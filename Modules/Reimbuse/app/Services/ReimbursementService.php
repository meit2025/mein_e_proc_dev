<?php

namespace Modules\Reimbuse\Services;

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
    protected $validator_rule = [
        'type'         =>  'required|string|exists:reimburse_types,code',
        'remark'       =>  'nullable',
        'balance'      =>  'required|numeric',
        'receipt_date' =>  'required|date',
        'start_date'   =>  'required|date',
        'end_date'     =>  'required|date',
        'period'       =>  'required|string|exists:reimburse_periods,code',
        'currency'     =>  'required|string|exists:currencies,code'
    ];

    public function checkGroupStatus(string $groupCode): string
    {
        $progressRecords = ReimburseProgress::where('group', $groupCode)->get();
        if ($progressRecords->contains('status', 'Rejected')) {
            return 'Rejected';
        }
        if ($progressRecords->contains('status', 'Open')) {
            return 'Open';
        }
        return 'Finished';
    }

    public function storeReimbursements($groupData, $forms)
    {
        try {
            DB::beginTransaction();

            $group = ReimburseGroup::create([
                'code'   => $this->generateUniqueGroupCode(),
                'remark' => $groupData['remark'],
                'requester' => $groupData['requester'],
            ]);

            foreach ($forms as $form) {
                $validator = Validator::make($form, $this->validator_rule);
                if ($validator->fails()) {
                    return $validator->errors();
                }
                $validatedData = $validator->validated();
                $validatedData['group'] = $group->code;

                $validatedData['receipt_date'] = Carbon::parse($form['receipt_date'])->format('Y-m-d');
                $validatedData['start_date'] = Carbon::parse($form['start_date'])->format('Y-m-d');
                $validatedData['end_date'] = Carbon::parse($form['end_date'])->format('Y-m-d');

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

            DB::commit();
            return "Reimbursements and progress stored successfully.";
        } catch (\Exception $e) {
            DB::rollBack();
            return $e->getMessage();
        }
    }


    public function updateReimbursements($forms)
    {
        try {
            DB::beginTransaction();

            foreach ($forms as $form) {
                $validator = Validator::make($form, $this->validator_rule);
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
