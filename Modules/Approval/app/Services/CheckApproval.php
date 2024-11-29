<?php

namespace Modules\Approval\Services;

use App\Models\User;
use Exception;
use Modules\Approval\Models\Approval;
use Modules\Approval\Models\ApprovalPr;
use Modules\Approval\Models\ApprovalTrackingNumberChoose;
use Modules\Approval\Models\ApprovalTrackingNumberChooseRoute;
use Modules\Master\Models\DocumentType;
use Modules\Master\Models\PurchasingGroup;

class CheckApproval
{
    // Helper function to get the base query
    private function getApprovalQuery($documentTypeId, $purchasingGroupId, $divisionId, $trackingNumberId = null)
    {
        $query = ApprovalPr::with('approvalRoute.user.divisions')
            ->where('document_type_id', $documentTypeId)
            ->where('purchasing_group_id', $purchasingGroupId)
            ->where('master_division_id', $divisionId);

        if ($trackingNumberId) {
            $query->where('master_tracking_number_id', $trackingNumberId);
        }

        return $query;
    }

    // Method to check approval based on conditions
    private function applyConditions($query, $conditions, $value)
    {
        foreach ($conditions as $condition) {
            $result = $query->where($condition)->first();
            if ($result) {
                return $result;
            }
        }
        return null;
    }

    // Main PR approval function
    public function PR($request, $save = false, $idDocument = null)
    {
        try {
            //code...
            $userId = $request->user_id;
            $user = User::findOrFail($userId);


            if (!$user->division_id) {
                throw new Exception('User has no division');
            }

            $documentType = DocumentType::where('purchasing_doc', $request->document_type_id ?? $request->document_type)->first();
            $purchasingGroup = PurchasingGroup::where('purchasing_group', $request->purchasing_group_id ?? $request->purchasing_groups)->first();

            // Define the conditions
            $conditions = [
                fn($query) => $query->where('condition_type', '=', '>')->where('value', '<', $request->value ?? $request->total_all_amount),
                fn($query) => $query->where('condition_type', '=', '>=')->where('value', '<=', $request->value ?? $request->total_all_amount),
                fn($query) => $query->where('condition_type', '=', '<')->where('value', '>', $request->value ?? $request->total_all_amount),
                fn($query) => $query->where('condition_type', '=', '<=')->where('value', '>=', $request->value ?? $request->total_all_amount),
                fn($query) => $query->where('condition_type', '=', 'range')->where('min_value', '<=', $request->value ?? $request->total_all_amount)->where('max_value', '>=', $request->value ?? $request->total_all_amount),
                fn($query) => $query->whereNull('condition_type'),
            ];

            $result = null;

            switch ($request->metode_approval) {
                case 'approval':
                case '':
                    $query = $this->getApprovalQuery($documentType->id, $purchasingGroup->id, $user->division_id);
                    $result = $this->applyConditions($query, $conditions, $request->value);
                    break;

                case 'chooses_approval':
                    $approvalTrackingNumberChoose = ApprovalTrackingNumberChooseRoute::where('approval_tracking_number_choose_id', $request->chooses_approval_id)
                        ->first();
                    $query = $this->getApprovalQuery($documentType->id, $purchasingGroup->id, $user->division_id, $approvalTrackingNumberChoose->master_tracking_number_id);
                    $result = $this->applyConditions($query, $conditions, $request->value);
                    break;

                case 'automatic_approval_by_purchasing_group':
                    $query = $this->getApprovalQuery($documentType->id, $purchasingGroup->id, $user->division_id, $purchasingGroup->master_tracking_number_id);
                    $result = $this->applyConditions($query, $conditions, $request->value);
                    break;

                default:
                    throw new Exception("Invalid metode_approval {$request->metode_approval}");
            }

            if (!$result) {
                throw new Exception('Approval not found');
            }

            if ($save) {
                foreach ($result->approvalRoute as $approvalRoute) {
                    Approval::create(
                        [
                            'user_id' => $approvalRoute->user_id,
                            'is_status' => false,
                            'message' => '',
                            'document_id' => $idDocument,
                            'document_name' => 'PR',
                        ]
                    );
                }
            }

            return $result;
        } catch (\Throwable $th) {
            throw new Exception($th->getMessage());
        }
    }

    public function Reim($request)
    {
        // Implement Reim logic if necessary
    }
}
