<?php

namespace Modules\Reimbuse\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Modules\Reimbuse\Models\Reimburse;
use Modules\Reimbuse\Models\ReimburseGroup;
use Modules\Reimbuse\Models\ReimburseProgress;

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

    public function storeReimbursements($groupData, $forms)
    {
        try {
            DB::beginTransaction();

            // Step 1: Create the reimbursement group
            $group = ReimburseGroup::create([
                'code'   => $this->generateUniqueGroupCode(),
                'remark' => $groupData['remark'],
                'requester' => $groupData['requester'],
            ]);

            // Step 2: Store each reimbursement form
            foreach ($forms as $form) {
                $validator = Validator::make($form, $this->validator_rule);
                if ($validator->fails()) {
                    return $validator->errors();
                }
                $validatedData = $validator->validated();
                $validatedData['group'] = $group->code;
                Reimburse::create($validatedData);
            }

            // Step 3: Generate progress entries for the approvers
            $requester = User::where('nip', $groupData['requester'])->first();
            $this->generateProgress($group, $requester);

            DB::commit();
            return "Reimbursements and progress stored successfully.";
        } catch (\Exception $e) {
            DB::rollBack();
            return $e->getMessage();
        }
    }

    // Function to generate progress based on the immediate_spv hierarchy
    protected function generateProgress($group, $user)
    {
        $approver = $user->immediate_spv;
        while ($approver) {
            // Find the approver user
            $approverUser = User::where('nip', $approver)->first();
            if (!$approverUser) break;  // Stop if the approver doesn't exist

            // Create the progress entry
            ReimburseProgress::create([
                'group' => $group->code,
                'approver' => $approverUser->nip,
                'notes' => '',
                'status' => 'Open'
            ]);

            // Move up to the next supervisor
            $approver = $approverUser->immediate_spv;
        }
    }


    protected function generateUniqueGroupCode()
    {
        return 'GROUP-' . uniqid();
    }
}
