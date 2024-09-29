<?php

namespace Modules\Reimbuse\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Modules\Reimbuse\Models\Reimburse;
use Modules\Reimbuse\Models\ReimburseGroup;

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
                Reimburse::create($validatedData);
            }
            DB::commit();
            return "Reimbursements stored successfully.";
        } catch (\Exception $e) {
            DB::rollBack();
            return $e->getMessage();
        }
    }

    protected function generateUniqueGroupCode()
    {
        return 'GROUP-' . uniqid();
    }
}
