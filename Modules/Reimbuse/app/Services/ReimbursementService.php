<?php

namespace Modules\Reimbuse\Services;

use App\Jobs\SapJobs;
use App\Jobs\SendNotification;
use App\Mail\ChangeStatus;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Modules\Approval\Models\Approval as ApprovalModels;
use Modules\Reimbuse\Models\Reimburse;
use Modules\Reimbuse\Models\ReimburseGroup;
use Modules\Reimbuse\Models\ReimburseProgress;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Modules\Reimbuse\Models\ReimburseAttachment;
use Modules\Approval\Services\CheckApproval;
use Modules\PurchaseRequisition\Services\ReimburseServices;

class ReimbursementService
{
    protected $approvalServices;

    public function __construct(CheckApproval $approvalServices)
    {
        date_default_timezone_set('Asia/Jakarta');
        $this->approvalServices = $approvalServices;
    }
    protected $validator_rule_group = [
        'remark'        =>  'nullable',
        'requester'     =>  'required|exists:users,nip',
        'cost_center'   =>  'required|exists:master_cost_centers,id',
    ];

    protected $validator_rule_reimburse = [
        'reimburse_type'                    =>  'required|exists:master_type_reimburses,code',
        'short_text'                        =>  'nullable',
        'balance'                           =>  'required|numeric',
        'remaining_balance_when_request'    =>  'required|numeric',
        'item_delivery_data'                =>  'required|date',
        'claim_date'                        =>  'required|date',
        'currency'                          =>  'required|string|exists:currencies,code',
        'for'                               =>  'required',
        'desired_vendor'                    =>  'required',
        'type'                              =>  'required|in:Employee,Family',
        'purchasing_group'                  =>  'required|exists:purchasing_groups,id',
        'tax_on_sales'                      =>  'required|exists:pajaks,id',
    ];

    public function checkGroupStatus(string $groupCode): string
    {
        $progressRecords = ReimburseProgress::where('group', $groupCode)->get();
        if ($progressRecords->contains('status', 'Rejected')) {
            return 'Rejected';
        }
        if ($progressRecords->contains('status', 'Open') || $progressRecords->count() == 0) {
            return 'Open';
        }
        return 'Finished';
    }

    public function storeReimbursements($groupData, $forms)
    {
        try {
            DB::beginTransaction();

            $validator_group = Validator::make($groupData, $this->validator_rule_group);
            if ($validator_group->fails()) {
                DB::rollBack();
                return ['error' => $validator_group->errors()];
            }
            $validatedDataGroup = $validator_group->validated();

            $validatedDataGroup['code']                 = $this->generateUniqueGroupCode();
            $validatedDataGroup['request_created_by']   = Auth::user()->id;
            $group = ReimburseGroup::create($validatedDataGroup);

            $balance = 0;
            foreach ($forms as $key => $form) {
                if (!isset($form['for'])) $form['for'] = $groupData['requester'];
                $form['desired_vendor'] = $groupData['requester'];
                $validator = Validator::make($form, $this->validator_rule_reimburse);
                if ($validator->fails()) {
                    DB::rollBack();
                    return ['error' => $validator->errors()];
                }
                $validatedData = $validator->validated();
                $validatedData['group'] = $group->code;
                $validatedData['purchase_requisition_unit_of_measure']   = $form['purchase_requisition_unit_of_measure'];
                $validatedData['item_number'] = $key + 1;
                $validatedData['item_delivery_data'] = Carbon::parse($form['item_delivery_data'])->format('Y-m-d');
                $validatedData['claim_date'] = Carbon::parse($form['claim_date'])->format('Y-m-d');
                $validatedData['requester'] = $groupData['requester'];

                $reimburse = Reimburse::create($validatedData);

                if (isset($form['attachment'])) {
                    foreach ($form['attachment'] as $file) {
                        $fileName = time() . '_' . str_replace(' ', '', $file->getClientOriginalName());
                        $filePath = $file->storeAs('reimburse', $fileName, 'public');
                        ReimburseAttachment::create([
                            'reimburse' => $reimburse->id,
                            'url' => $fileName,
                        ]);
                    }
                }
                $balance += $form['balance'];
            }

            $parseForApproval = [
                'requester' => $group->requester,
                'value'     => $balance
            ];
            $this->approvalServices->Payment((object)$parseForApproval, true, $group->id, 'REIM');

            // send notif email to approver
            // $baseurl = env('APP_URL') .  '/reimburse/detail/' .  $group->id;
            // $getApproval = ApprovalModels::where('document_id', $group->id)->where('document_name', 'REIM')->orderBy('id', 'ASC')->first();
            // $getUserApproval = User::where('id', $getApproval->user_id)->first();
            // if (!empty($getUserApproval)) {
            //     $reimburseGroup = ReimburseGroup::with(['reimburses.reimburseType'])->find($group->id);
            //     $reimburseGroup->notes = '';

            //     Mail::to($getUserApproval->email)->send(new ChangeStatus($getUserApproval, 'Reimbursement', 'Approver', '', null, $reimburseGroup, null, $baseurl));
            // }

            // $reim = new ReimburseServices();
            // $reim->processTextData($group->id);

            DB::commit();
            return "Reimbursements and progress stored successfully.";
        } catch (\Exception $e) {
            DB::rollBack();
            return ['error' => $e->getMessage()];
        }
    }


    public function updateReimbursements($groupData, $forms)
    {
        try {
            DB::beginTransaction();
            $reimburseGroup = ReimburseGroup::find($groupData['groupId']);
            $reimburseGroup->remark         = $groupData['remark'];
            $reimburseGroup->status_id         = 1;
            $reimburseGroup->cost_center    = $groupData['cost_center'];
            $reimburseGroup->save();

            $balance = 0;

            foreach ($forms as $form) {
                if (!isset($form['for'])) $form['for'] = $groupData['requester'];
                $form['desired_vendor']   = $groupData['requester'];
                $form['item_delivery_data']         = Carbon::parse($form['item_delivery_data'])->format('Y-m-d');
                $form['claim_date']                 = Carbon::parse($form['claim_date'])->format('Y-m-d');

                $validator = Validator::make($form, $this->validator_rule_reimburse);
                if ($validator->fails()) {
                    return ['error' => $validator->errors()];
                }
                $validatedData = $validator->validated();
                // $validatedData['short_text'] = $form['short_text'];
                
                $reimburse = Reimburse::find($form['reimburseId']);
                if ($reimburse) {
                    $reimburse->update($validatedData);

                    if (isset($form['attachment'])) {
                        foreach ($reimburse->attachments as $attachment) {
                            Storage::delete($attachment->path);
                            $attachment->delete();
                        }

                        foreach ($form['attachment'] as $file) {
                            $path = $file->store('reimburse_attachments');
                            ReimburseAttachment::create([
                                'reimburse_id' => $reimburse->id,
                                'path' => $path,
                            ]);
                        }
                    }
                }
                $balance += $form['balance'];
            }

            DB::commit();
            $parseForApproval = [
                'requester' => $reimburseGroup->requester,
                'value'     => $balance
            ];
            $this->approvalServices->Payment((object)$parseForApproval, true, $reimburseGroup->id, 'REIM');
            return "Reimbursements updated successfully.";
        } catch (\Exception $e) {
            DB::rollBack();
            return $e->getMessage();
        }
    }

    protected function generateProgress($group, $user)
    {
        $approver = $user->immediate_spv;
        while ($approver) {
            $approverUser = User::where('nip', $approver)->first();
            if (!$approverUser) break;
            ReimburseProgress::create([
                'group' => $group->code,
                'approver' => $approverUser->nip,
                'notes' => '',
                'status' => 'Open'
            ]);
            $approver = $approverUser->immediate_spv;
        }
    }


    protected function generateUniqueGroupCode()
    {
        $latestRecord = ReimburseGroup::latest('id')->first();
        if (empty($latestRecord)) {
            $incerement = str_pad(0, 8, '0', STR_PAD_LEFT);
        } else {
            $getIncerement  = intval(explode('-', $latestRecord->code)[3]) + 1;
            $incerement     = str_pad($getIncerement, 8, '0', STR_PAD_LEFT);
        }

        return 'REIM-' . date('Y-m') . '-' . $incerement;
    }
}
