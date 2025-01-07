<?php

namespace Modules\Reimbuse\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Reimbuse\Models\Reimburse;
use Modules\Reimbuse\Models\ReimburseGroup;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Modules\Approval\Models\Approval;
use Modules\BusinessTrip\Models\BusinessTripGrade;
use Modules\BusinessTrip\Models\BusinessTripGradeUser;
use Modules\Master\Models\Family;
use Modules\Master\Models\MasterCostCenter;
use Modules\Master\Models\MasterTypeReimburse;
use Modules\Master\Models\MasterTypeReimburseGrades;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\Uom;
use Modules\Master\Models\PurchasingGroup;
use Modules\Reimbuse\Services\ReimbursementService;

class MyReimburseController extends Controller
{

    public function index()
    {
        return Inertia::render('MyReimburse/Index');
    }

    public function list(Request $request, $isEmployee)
    {
        try {
            $query  = MasterTypeReimburse::with([
                'reimburses' => function ($query) {
                    $query->where(['requester' => Auth::user()->nip])
                    ->whereIn('status_id', [1,5]);
                },
                'reimburseTypeGrades.grade.gradeUsers' => function ($query) {
                    $query->where('user_id', Auth::user()->id);
                }
            ])
            ->where('is_employee', $isEmployee)
            ->orWhere(function ($query) use ($isEmployee) {
                $query->where('grade_option', 'all')
                ->where('is_employee', $isEmployee);
            });
            

            $perPage = $request->get('per_page', 10);
            $query->orderBy('master_type_reimburses.name', 'asc');
            $data = $query->paginate($perPage);
            
            $data->getCollection()->transform(function ($map) use ($isEmployee) {
                $map = json_decode($map);
                // return $map;
                // Balance Plafon
                if (count($map->reimburse_type_grades) > 0) {
                    $maximumBalance = collect($map->reimburse_type_grades)->pluck('plafon')->first();
                } else {
                    $maximumBalance = $map->grade_all_price;
                }
                // Total Balance Requested
                $totalUnpaid = collect($map->reimburses)->filter(function ($reimburse) {
                    return $reimburse->requester == Auth::user()->nip;
                })->sum('balance');
                
                // Remaining Balance
                $remainingBalance = (int)$maximumBalance - $totalUnpaid;

                // Last Claim Date
                $lastClaimDate = collect($map->reimburses)->isNotEmpty() ? 
                    collect($map->reimburses)->max('claim_date') : null;
                
                // Available Claim Date
                if ($map->interval_claim_period == null || $lastClaimDate == null) {
                    $availableClaimDate = null;
                } else {
                    $createDate         = Carbon::createFromFormat('Y-m-d', $lastClaimDate);
                    $availableClaimDate = $createDate->addDays((int)$map->interval_claim_period);
                }

                $return = [
                    'id'                            => $map->id,
                    'reimburseType'                 => $map->name .' ('.$map->code.')',
                    'intervalClaim'                 => $map->interval_claim_period ?  $map->interval_claim_period / 365 . ' Year' : '-',
                    'currency'                      => 'IDR',
                    'maximumBalance'                => $maximumBalance,
                    'remainingBalance'              => $remainingBalance,
                    'lastClaimDate'                 => $lastClaimDate,
                    'availableClaimDate'            => $availableClaimDate,
                    'totalPaid'                     => 0,
                    'totalUnpaid'                   => $totalUnpaid
                ];

                if ($isEmployee == false) $return['relation'] = ucwords($map->family_status);
                
                return $return;
            });
            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
}
