<?php

namespace Modules\Approval\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Modules\Approval\Models\Approval;
use Modules\Approval\Models\ApprovalPr;
use Modules\Approval\Models\ApprovalRoute;
use Modules\Approval\Models\ApprovalRouteUsers;
use Modules\Approval\Models\ApprovalToUser;
use Modules\Approval\Models\ApprovalTrackingNumberChoose;
use Modules\Approval\Models\ApprovalTrackingNumberChooseRoute;
use Modules\Approval\Models\SettingApproval;
use Modules\Master\Models\DocumentType;
use Modules\Master\Models\ExchangeRate;
use Modules\Master\Models\PurchasingGroup;

class CheckApproval
{
    // Helper function to get the base query
    private function getApprovalQuery($documentTypeId, $purchasingGroupId, $divisionId, $positionId, $trackingNumberId = null)
    {
        $query = ApprovalPr::with('approvalRoute.user.divisions')
            ->where('document_type_id', $documentTypeId)
            ->where('purchasing_group_id', $purchasingGroupId)
            ->where('master_position_id', $positionId)
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
            $tempQuery = clone $query;
            $condition($tempQuery);
            $result = $tempQuery->first();
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
            $total = (int)$request->value == 0 ? (int)$request->total_all_amount : (int)$request->value;
            if ($request->currency_from != 'IDR') {
                $exchangeRate = ExchangeRate::getExchangeRate($request->currency_from, 'IDR', $total);
                $total = (int)$exchangeRate;
            }
            $conditions = [
                fn($query) => $query->where('condition_type', '=', '>')
                    ->whereRaw('? > value', [$total]),
                fn($query) => $query->where('condition_type', '=', '>=')
                    ->whereRaw('? >= value', [$total]),
                fn($query) => $query->where('condition_type', '=', '<')
                    ->whereRaw('? < value', [$total]),
                fn($query) => $query->where('condition_type', '=', '<=')
                    ->whereRaw('? <= value', [$total]),
                fn($query) => $query->where('condition_type', '=', 'range')
                    ->whereRaw("min_value <= ?", [$total])
                    ->whereRaw("max_value >= ?", [$total]),
                fn($query) => $query->where('is_condition', false)->where('value', '=', $total),
            ];

            $result = null;

            switch ($request->metode_approval) {
                case 'approval':
                case '':
                    $query = $this->getApprovalQuery($documentType->id, $purchasingGroup->id, $user->division_id, $user->position_id);
                    $result = $this->applyConditions($query, $conditions, $request->value);
                    break;

                case 'chooses_approval':

                    $query = $this->getApprovalQuery($documentType->id, $purchasingGroup->id, $user->division_id, $user->position_id, $request->tracking_approval_id);
                    $result = $this->applyConditions($query, $conditions, $request->value);
                    break;

                case 'automatic_approval_by_purchasing_group':
                    $query = $this->getApprovalQuery($documentType->id, $purchasingGroup->id, $user->division_id, $user->position_id, $purchasingGroup->master_tracking_number_id);
                    $result = $this->applyConditions($query, $conditions, $request->value);
                    break;

                default:
                    throw new Exception("Invalid metode_approval {$request->metode_approval}");
            }

            if (!$result) {
                throw new Exception('Approval not found');
            }

            if ($save) {
                foreach ($result->approvalRoute as $key => $approvalRoute) {
                    Approval::create(
                        [
                            'user_id' => $approvalRoute->user_id,
                            'is_status' => false,
                            'is_approval' => $key == 0 ? true : false,
                            'number_approval' => $key + 1,
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

    public function Payment($request, $save = false, $idDocument = null, $type = null)
    {
        // Implement Reim logic if necessary
        try {
            //code...
            // dd($request);

            if (isset($request->user_id)) {
                $getUserId = User::where('id', $request->user_id)->first();
            } else if (isset($request->requester)) {
                $getUserId = User::where('nip', $request->requester)->orwhere('username', $request->requester)->first();
            }

            if (!$getUserId) {
                throw new Exception('Username not found');
            }

            // get approval
            $approval = ApprovalToUser::where('user_id', $getUserId->id)->first();
            if (!$approval) {
                throw new Exception('Approval not found');
            }

            // get Approval route
            $approvalRoute = ApprovalRoute::where('id', $approval->approval_route_id)->first(); // get approval route

            if (!$approvalRoute) {
                throw new Exception('Approval route not found');
            }


            $dataUser = null;
            // get hr approval
            if ($approvalRoute->is_hr) {
                // get setting approval hr
                $settingApprovalHr = SettingApproval::where('key', 'approval_hr')->first();

                $dataUser = User::select(
                    'users.id',
                    'users.name',
                    'master_divisions.name as division_name'
                )
                    ->leftJoin('master_divisions', 'master_divisions.id', '=', 'users.division_id')

                    ->where('username', $settingApprovalHr->value)->first();
                if (!$dataUser) {
                    throw new Exception('User hr not found, contact admin');
                }
            }

            // mapping approval route
            $getApproval = ApprovalRouteUsers::select(
                'users.id',
                'users.name',
                'master_divisions.name as division_name'
            )
                ->join('users', 'approval_route_users.user_id', '=', 'users.id')
                ->where('approval_route_id', $approval->approval_route_id)
                ->leftJoin('master_divisions', 'master_divisions.id', '=', 'users.division_id')

                ->orderBy('approval_route_users.id', 'asc')
                ->get()->toArray();

            if ($approvalRoute->is_hr) {
                $hrUser = [
                    'id' => $dataUser->id,
                    'name' => $dataUser->name,
                    'division_name' => $dataUser->division_name,
                ];

                if ($approvalRoute->hr_approval === 'start') {
                    // Add HR user to the start of the array
                    array_unshift($getApproval, $hrUser);
                } elseif ($approvalRoute->hr_approval === 'end') {
                    // Add HR user to the end of the array
                    $getApproval[] = $hrUser;
                }
            }


            // chcek condition approval
            $ApprovalCondition = ApprovalRoute::where('nominal', '<=', $request->value)
                ->where('nominal', '!=', 0)
                ->orderBy('nominal', 'desc')
                ->first();

            if ($ApprovalCondition) {
                $getApprovalConditional = ApprovalRouteUsers::select('users.id', 'users.name', 'master_divisions.name as division_name')
                    ->join('users', 'approval_route_users.user_id', '=', 'users.id')
                    ->leftJoin('master_divisions', 'master_divisions.id', '=', 'users.division_id')
                    ->where('approval_route_id', $ApprovalCondition->id)
                    ->orderBy('approval_route_users.id', 'asc')
                    ->get()->toArray();

                $getApproval = array_merge($getApproval, $getApprovalConditional);
            }

            if ($save) {
                foreach ($getApproval as $key =>  $approvalRoute) {
                    Approval::create(
                        [
                            'user_id' => $approvalRoute['id'],
                            'is_status' => false,
                            'message' => '',
                            'document_id' => $idDocument,
                            'document_name' => $type,
                            'is_approval' => $key == 0 ? true : false,
                            'number_approval' => $key + 1,
                        ]
                    );
                }
            }

            return [
                'approval' => $getApproval,
                'hr' => $dataUser
            ];
        } catch (\Throwable $th) {
            //throw $th;
            throw new Exception($th->getMessage());
        }
    }
}
