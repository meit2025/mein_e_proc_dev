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
use Illuminate\Support\Facades\DB;
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
            $getFamilieStatus   = User::select('f.status')->join('families as f', 'f.userId', '=', 'users.id')->where('users.nip', Auth::user()->nip)->groupBy('f.status')->pluck('f.status')->toArray();
            $userId             = Auth::user()->id;

            $query = MasterTypeReimburse::with([
                'reimburses' => function ($reimburseQuery) {
                    $reimburseQuery->join('reimburse_groups as rg', 'reimburses.group', '=', 'rg.code')
                        ->where(['reimburses.requester' => Auth::user()->nip])
                        ->whereIn('rg.status_id', [1, 3, 5])
                        ->select('reimburses.*')
                        ->with('reimburseGroup');
                }
            ])
            ->select('master_type_reimburses.*')
            ->leftJoin('master_type_reimburse_grades as mtrg', 'mtrg.reimburse_type_id', '=', 'master_type_reimburses.id')
            ->leftJoin('business_trip_grades as btg', 'btg.id', '=', 'mtrg.grade_id')
            ->leftJoin('business_trip_grade_users as btgu', 'btgu.grade_id', '=', 'btg.id')
            ->leftJoin('master_type_reimburse_user_assign as mtrua_grade_relation_exist', function($join) {
                $join->on('mtrua_grade_relation_exist.user_id', '=', 'btgu.user_id')
                ->where('mtrua_grade_relation_exist.is_assign', '=', true);
            })
            ->leftJoin('master_type_reimburse_user_assign as mtrua_grade_relation_not_exist', function($join) use ($userId) {
                $join->on('mtrua_grade_relation_not_exist.reimburse_type_id', '=', 'master_type_reimburses.id')
                ->where('mtrua_grade_relation_not_exist.user_id', '=', $userId)
                ->where('mtrua_grade_relation_not_exist.is_assign', '=', true);
            })
            ->leftJoin('users as u', function($join) {
                $join->on('u.id', '=', 'mtrua_grade_relation_exist.user_id')
                ->orOn('u.id', '=', 'mtrua_grade_relation_not_exist.user_id');
            })
            ->where([
                'u.id' => Auth::user()->id,
                'master_type_reimburses.is_employee' => $isEmployee
            ])->where(function($query) {
                $query->whereNotNull('mtrua_grade_relation_exist.user_id')->orWhereNotNull('mtrua_grade_relation_not_exist');
            });
            
            if ($isEmployee == 0 && count($getFamilieStatus) != 0) {
                $query->whereIn('family_status', $getFamilieStatus);
            }

            if ($request->search) {
                $query = $query->where(function($query) use ($request) {
                    $query->where('master_type_reimburses.code', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('master_type_reimburses.name', 'ILIKE', '%' . $request->search . '%');
                }); 
            }
            
            $query->orWhere(function ($query) use ($isEmployee, $getFamilieStatus, $request) {
                $query->where('grade_option', 'all')
                    ->where('is_employee', $isEmployee)
                    ->where(function($query) {
                        $query->whereNotNull('mtrua_grade_relation_exist.user_id')->orWhereNotNull('mtrua_grade_relation_not_exist');
                    });
            
                if ($isEmployee == 0 && count($getFamilieStatus) != 0) {
                    $query->whereIn('family_status', $getFamilieStatus);
                }

                if ($request->search) {
                    $query = $query->where(function($query) use ($request) {
                        $query->where('master_type_reimburses.code', 'ILIKE', '%' . $request->search . '%')
                        ->orWhere('master_type_reimburses.name', 'ILIKE', '%' . $request->search . '%');
                    }); 
                }
            });
            
            $orderBy = $request->sort_by == 'id' ? 'master_type_reimburses.name' : $request->sort_by;
            $sortBy = $request->sort_by == 'id' ? 'asc' : $request->sort_direction;
            $query->groupBy('master_type_reimburses.id');
            $query->orderBy($orderBy, $sortBy);
            $perPage = $request->get('per_page', 10);
            $queryResult = $query->paginate($perPage);
            
            $queryResult->getCollection()->each(function ($masterTypeReimburse) {
                $masterTypeReimburse->load([
                    'reimburseTypeGrades.grade.gradeOneUsers.reimburseTypeAssignUsers' => function ($assignQuery) use ($masterTypeReimburse) {
                        $assignQuery->where('reimburse_type_id', $masterTypeReimburse->id)
                            ->where('is_assign', true);
                    },
                    'reimburseTypeUserAssign' => function ($assignQuery) use ($masterTypeReimburse) {
                        $assignQuery->where([
                            'reimburse_type_id' => $masterTypeReimburse->id,
                            'user_id' => Auth::user()->id,
                            'is_assign' => true
                        ]);
                    }
                ]);
            });
            
            $queryResult->getCollection()->transform(function ($map) use ($isEmployee) {
                $map = json_decode($map);
                // return $map;
                // Balance Plafon
                if ($map->grade_option == 'grade' && count($map->reimburse_type_grades) > 0) {
                    $maximumBalance = collect($map->reimburse_type_grades)
                        ->filter(function ($reimburseTypeGrade) {
                            return isset($reimburseTypeGrade->grade) &&
                                !empty($reimburseTypeGrade->grade->grade_one_users) &&
                                collect($reimburseTypeGrade->grade->grade_one_users)
                                    ->contains('user_id', Auth::user()->id);
                        })
                        ->pluck('plafon')
                        ->first();
                } else {
                    $maximumBalance = $map->grade_all_price;
                }
                
                // Total Balance Requested
                $getBalanceOnPr = Reimburse::selectRaw("
                    reimburses.balance as balance, 
                    mtr.interval_claim_period as has_interval_claim, 
                    pr.is_closed as status_closed,
                    CASE 
                        WHEN 
                            mtr.interval_claim_period is not null
                            AND CURRENT_DATE >= reimburses.claim_date 
                            AND CURRENT_DATE <= reimburses.claim_date + (mtr.interval_claim_period || ' days')::interval 
                        THEN 1
                        ELSE 0
                    END
                    AS on_interval
                ")
                ->join('master_type_reimburses as mtr', 'mtr.code', '=', 'reimburses.reimburse_type')
                ->join('reimburse_groups as rg', 'rg.code', '=', 'reimburses.group')
                ->leftJoin('purchase_requisitions as pr', function ($join) {
                    $join->on('rg.id', '=', DB::raw('CAST(pr.purchase_id AS BIGINT)'))
                        ->on('reimburses.item_number', '=', DB::raw('CAST(pr.item_number AS BIGINT)'));
                })
                ->where(function ($query) use ($map) {
                    $query->where('reimburses.requester', Auth::user()->nip)
                        ->where('reimburses.reimburse_type', $map->code)
                        ->where('pr.code_transaction', 'REIM')
                        ->whereIn('rg.status_id', [1, 3, 5]);
                })
                ->orWhere(function ($query) use ($map) {
                    $query->where('reimburses.requester', Auth::user()->nip)
                        ->where('reimburses.reimburse_type', $map->code)
                        ->whereNull('pr.code_transaction')
                        ->whereIn('rg.status_id', [1, 3, 5]);
                })->get()->toArray();

                $unpaidBalance = array_sum(array_column(array_filter($getBalanceOnPr, function ($value) { return $value['status_closed'] != 'S' && (($value['has_interval_claim'] !== null && $value['on_interval'] == 1) || $value['has_interval_claim'] == null); }), 'balance'));
                $paidBalance = array_sum(array_column(array_filter($getBalanceOnPr, function ($value) { return $value['status_closed'] == 'S' && (($value['has_interval_claim'] !== null && $value['on_interval'] == 1) || $value['has_interval_claim'] == null); }), 'balance'));

                // Remaining Balance
                $remainingBalance = (int)$maximumBalance - ($paidBalance + $unpaidBalance);
            
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
                    'name'                          => $map->name .' ('.$map->code.')',
                    'interval_claim_period'         => $map->interval_claim_period ?  $map->interval_claim_period / 365 . ' Year' : '-',
                    'currency'                      => 'IDR',
                    'maximumBalance'                => $maximumBalance,
                    'remainingBalance'              => $remainingBalance,
                    'lastClaimDate'                 => $lastClaimDate,
                    'availableClaimDate'            => $availableClaimDate,
                    'totalPaid'                     => $paidBalance,
                    'totalUnpaid'                   => $unpaidBalance
                ];
            
                if ($isEmployee == false) $return['family_status'] = ucwords($map->family_status);
            
                return $return;
            });

            return $this->successResponse($queryResult);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function listBalanceFamily(Request $request, $id, $relation, $maximumBalance)
    {
        try {
            $query = Family::where('userId', Auth::user()->id)
            ->where('status', $relation);

            if ($request->search) {
                $query = $query->where('name', 'ILIKE', '%' . $request->search . '%');
            }
            
            $query->orderBy('families.name', 'asc');
            $perPage = $request->get('per_page', 10);
            $data = $query->paginate($perPage);
            $data->getCollection()->transform(function ($map) use ($id, $maximumBalance
            ) {
                $map = json_decode($map);

                $getBalanceOnPr = Reimburse::selectRaw("
                    reimburses.balance as balance,
                    reimburses.claim_date,
                    mtr.interval_claim_period, 
                    pr.is_closed as status_closed,
                    CASE 
                        WHEN 
                            mtr.interval_claim_period is not null
                            AND CURRENT_DATE >= reimburses.claim_date 
                            AND CURRENT_DATE <= reimburses.claim_date + (mtr.interval_claim_period || ' days')::interval 
                        THEN 1
                        ELSE 0
                    END
                    AS on_interval
                ")
                ->join('master_type_reimburses as mtr', 'mtr.code', '=', 'reimburses.reimburse_type')
                ->join('reimburse_groups as rg', 'rg.code', '=', 'reimburses.group')
                ->leftJoin('purchase_requisitions as pr', function ($join) {
                    $join->on('rg.id', '=', DB::raw('CAST(pr.purchase_id AS BIGINT)'))
                        ->on('reimburses.item_number', '=', DB::raw('CAST(pr.item_number AS BIGINT)'));
                })
                ->where(function ($query) use ($map, $id) {
                    $query->where('reimburses.for', $map->id)
                        ->where('mtr.id',  $id)
                        ->where('pr.code_transaction', 'REIM')
                        ->whereIn('rg.status_id', [1, 3, 5]);
                })
                ->orWhere(function ($query) use ($map, $id) {
                    $query->where('reimburses.for', $map->id)
                        ->where('mtr.id',  $id)
                        ->whereNull('pr.code_transaction')
                        ->whereIn('rg.status_id', [1, 3, 5]);
                })->orderByDesc('reimburses.id')->get()->toArray();

                $unpaidBalance = array_sum(array_column(array_filter($getBalanceOnPr, function ($value) { return $value['status_closed'] != 'S' && (($value['interval_claim_period'] !== null && $value['on_interval'] == 1) || $value['interval_claim_period'] == null); }), 'balance'));
                $paidBalance = array_sum(array_column(array_filter($getBalanceOnPr, function ($value) { return $value['status_closed'] == 'S' && (($value['interval_claim_period'] !== null && $value['on_interval'] == 1) || $value['interval_claim_period'] == null); }), 'balance'));

                // Remaining Balance
                $remainingBalance   = (int)$maximumBalance - ($paidBalance + $unpaidBalance);
                
                $reimburses = !empty($getBalanceOnPr) ? $getBalanceOnPr[0] : [];
                
                // Last Claim Date
                $lastClaimDate = !empty($reimburses) ? 
                    $reimburses['claim_date'] : null;
                
                // Available Claim Date
                if ((empty($reimburses) && $reimburses['interval_claim_period'] == null) || $lastClaimDate == null) {
                    $availableClaimDate = null;
                } else {
                    $createDate         = Carbon::createFromFormat('Y-m-d', $lastClaimDate);
                    $availableClaimDate = $createDate->addDays((int)$reimburses['interval_claim_period']);
                }

                $return = [
                    'id'                            => $map->id,
                    'familyName'                    => $map->name,
                    'remainingBalance'              => $remainingBalance,
                    'lastClaimDate'                 => $lastClaimDate,
                    'availableClaimDate'            => $availableClaimDate,
                    'totalPaid'                     => $paidBalance,
                    'totalUnpaid'                   => $unpaidBalance
                ];

                return $return;
            });

            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

}
