<?php

namespace Modules\Reimbuse\Services;

use App\Jobs\SapJobs;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Modules\Reimbuse\Models\Reimburse;
use Modules\Reimbuse\Models\ReimburseGroup;
use Modules\Reimbuse\Models\ReimburseProgress;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Modules\Reimbuse\Models\ReimburseAttachment;

class ReimbursementService
{
    protected $validator_rule_group = [
        'remark'        =>  'nullable',
        'requester'     =>  'required|exists:users,nip',
        'cost_center'   =>  'required|exists:master_cost_centers,id',
    ];

    protected $validator_rule_reimburse = [
        'reimburse_type'        =>  'required|exists:master_type_reimburses,code',
        'short_text'            =>  'nullable',
        'balance'               =>  'required|numeric',
        'item_delivery_data'    =>  'required|date',
        'start_date'            =>  'required|date',
        'end_date'              =>  'required|date',
        'period'                =>  'required|string|exists:master_period_reimburses,code',
        'currency'              =>  'required|string|exists:currencies,code',
        'for'                   =>  'required',
        'desired_vendor'        =>  'required',
        'type'                  =>  'required|in:Employee,Family',
        'purchasing_group'      =>  'required|exists:purchasing_groups,id',
        'tax_on_sales'          =>  'required|exists:pajaks,id',
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

            $validatedDataGroup['code'] = $this->generateUniqueGroupCode();
            $group = ReimburseGroup::create($validatedDataGroup);




            foreach ($forms as $form) {

                if (!isset($form->for)) {
                    $form['for'] = $groupData['requester'];
                }
                $form['desired_vendor'] = $groupData['requester'];
                $validator = Validator::make($form, $this->validator_rule_reimburse);
                if ($validator->fails()) {
                    DB::rollBack();
                    return ['error' => $validator->errors()];
                }
                $validatedData = $validator->validated();
                $validatedData['group'] = $group->code;
                $validatedData['item_delivery_data'] = Carbon::parse($form['item_delivery_data'])->format('Y-m-d');
                $validatedData['start_date'] = Carbon::parse($form['start_date'])->format('Y-m-d');
                $validatedData['end_date'] = Carbon::parse($form['end_date'])->format('Y-m-d');
                $validatedData['requester'] = $group['requester'];


                $reimburse = Reimburse::create($validatedData);

                if (isset($form['attachments'])) {
                    foreach ($form['attachments'] as $file) {
                        $filePath = $file->store('reimburse_attachments', 'public');
                        ReimburseAttachment::create([
                            'reimburse' => $reimburse->id,
                            'url' => $filePath,
                        ]);
                    }
                }
            }

            $requester = User::where('nip', $groupData['requester'])->first();
            $this->generateProgress($group, $requester);

            SapJobs::dispatch($group->id, 'REIM');

            DB::commit();
            return "Reimbursements and progress stored successfully.";
        } catch (\Exception $e) {
            DB::rollBack();
            return ['error' => $e->getMessage()];
        }
    }


    public function updateReimbursements($forms)
    {
        try {
            DB::beginTransaction();

            foreach ($forms as $form) {
                $validator = Validator::make($form, $this->validator_rule_reimburse);
                if ($validator->fails()) {
                    return $validator->errors();
                }

                $validatedData = $validator->validated();
                $reimburse = Reimburse::where('id', $form['id'])->first();
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
            }

            DB::commit();
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
        return 'GROUP-' . uniqid();
    }
}
