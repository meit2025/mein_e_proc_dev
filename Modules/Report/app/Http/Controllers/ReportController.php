<?php

namespace Modules\Report\Http\Controllers;

use App\Exports\BusinessTripDeclarationExport;
use App\Exports\BusinessTripExport;
use App\Exports\BusinessTripOverallExport;
use App\Exports\BusinessTripAttendanceExport;
use App\Exports\PurchaseRequisitionExport;
use App\Exports\ReimburseExport;
use App\Exports\MyReimburseExport;
use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Modules\Approval\Models\Approval;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\BusinessTrip\Models\BusinessTripDetailAttedance;
use Modules\BusinessTrip\Models\Destination;
use Modules\BusinessTrip\Models\PurposeType;
use Modules\Master\Models\DocumentType;
use Modules\Master\Models\MasterCostCenter;
use Modules\Master\Models\MasterDepartment;
// use Modules\Master\Models\MasterPeriodReimburse;
use Modules\Master\Models\MasterStatus;
use Modules\Master\Models\MasterTypeReimburse;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\PurchasingGroup;
use Modules\PurchaseRequisition\Models\Purchase;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;
use Modules\PurchaseRequisition\Models\Vendor;
use Modules\Reimbuse\Models\Reimburse;
use Modules\Reimbuse\Models\ReimburseGroup;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Report/Reimbuse/Index');
    }

    public function list(Request $request)
    {
        try {
            $startDate = $request->get('startDate');
            $endDate = $request->get('endDate');
            $status = $request->get('status');
            $type = $request->get('type');
            $department = $request->get('department');

            $query =  ReimburseGroup::query()->with(['reimburses', 'status', 'user']);

            if ($request->approval == 1) {
                $approval = Approval::where('user_id', Auth::user()->id)
                    ->where(['document_name' => 'REIM', 'status' => 'Waiting'])->pluck('document_id')->toArray();
                $query = $query->whereIn('id', $approval);
            } else {
                if (Auth::user()->is_admin == '0') $data = $query->where('requester', Auth::user()->nip);
            }

            if ($startDate && $endDate) {
                $query->whereDate('created_at', '>=', $startDate)
                    ->whereDate('created_at', '<=', $endDate);
            }
            if ($status) {
                $query->whereHas('status', function ($q) use ($status) {
                    $q->where('code', $status);
                });
            }
            if ($type) {
                $query->whereHas('reimburses', function ($q) use ($type) {
                    $q->where('reimburse_type', $type);
                });
            }

            if ($department) {
                $query->whereHas('user', function ($q) use ($department) {
                    $q->where('departement_id', $department);
                });
            }

            if ($request->search) {
                $query = $query->where(function ($query) use ($request) {
                    $query->where('code', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('remark', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('requester', 'ILIKE', '%' . $request->search . '%')
                    ->orWhereHas('reimburses', function ($q) use ($request) {
                        $q->where('remark', 'ILIKE', '%' . $request->search . '%');
                    })
                    ->orWhereHas('status', function ($q) use ($request) {
                        $q->where('name', 'ILIKE', '%' . $request->search . '%');
                    })
                    ->orWhereHas('user', function ($q) use ($request) {
                        $q->where('name', 'ILIKE', '%' . $request->search . '%');
                    });
                });
            }

            $perPage = $request->get('per_page', 10);
            $sortBy = $request->get('sort_by', 'id');
            $sortDirection = $request->get('sort_direction', 'asc');
            $query->orderBy($sortBy, 'desc');
            $data = $query->paginate($perPage);
            $data->getCollection()->transform(function ($map) {
                $balance = 0;
                foreach ($map->reimburses as $reimburse) {
                    $balance += $reimburse->balance;
                }
                $map = json_decode($map);
                return [
                    'id' => $map->id,
                    'code' => $map->code,
                    'request_for' => $map->user->name,
                    'remark' => $map->remark,
                    'balance' => $balance,
                    'form' => count($map->reimburses),
                    'status' => [
                        'name' => $map->status->name,
                        'classname' => $map->status->classname,
                        'code' =>
                        $map->status->code
                    ],
                    'createdDate' => $map->created_at,

                ];
            });
            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function export(Request $request)
    {
        try {
            $startDate = $request->get('startDate');
            $endDate = $request->get('endDate');
            $status = $request->get('status');
            $type = $request->get('type');
            $department = $request->get('department');

            // Start the query with relationships
            $query = ReimburseGroup::query()->with(['reimburses', 'status', 'user', 'reimburses.reimburseType.gradeReimburseTypes', 'reimburses.purchasingGroupModel.approvalPr', 'PurchaseRequisition']);

            // Handle approval-specific filtering
            if ($request->approval == 1) {
                $approval = Approval::where('user_id', Auth::id())
                    ->where(['document_name' => 'REIM', 'status' => 'Waiting'])
                    ->pluck('document_id')
                    ->toArray();

                $query->whereIn('id', $approval);
            } else {
                // Filter for non-admin users based on requester
                if (Auth::user()->is_admin == '0') {
                    $query->where('requester', Auth::user()->nip);
                }
            }

            if ($startDate && $endDate) {
                $query->whereDate('created_at', '>=', $startDate)
                    ->whereDate('created_at', '<=', $endDate);
            }
            if ($status) {
                $query->whereHas('status', function ($q) use ($status) {
                    $q->where('code', $status);
                });
            }
            if ($type) {
                $query->whereHas('reimburses', function ($q) use ($type) {
                    $q->where('reimburse_type', $type);
                });
            }
            if ($department) {
                $query->whereHas('user', function ($q) use ($department) {
                    $q->where('departement_id', $department);
                });
            }

            if ($request->search) {
                $query = $query->where(function ($query) use ($request) {
                    $query->where('code', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('remark', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('requester', 'ILIKE', '%' . $request->search . '%')
                    ->orWhereHas('reimburses', function ($q) use ($request) {
                        $q->where('remark', 'ILIKE', '%' . $request->search . '%');
                    })
                    ->orWhereHas('status', function ($q) use ($request) {
                        $q->where('name', 'ILIKE', '%' . $request->search . '%');
                    })
                    ->orWhereHas('user', function ($q) use ($request) {
                        $q->where('name', 'ILIKE', '%' . $request->search . '%');
                    });
                });
            }

            // Handle pagination and sorting
            $sortBy = $request->get('sort_by', 'id');
            $sortDirection = $request->get('sort_direction', 'asc');

            $query->orderBy($sortBy, $sortDirection);

            // Retrieve the data
            $data = $query->get();

            // Transform data for export
            $transformedData = $data->map(function ($item) {
                $balance = $item->reimburses->sum('balance');


                return [
                    'code' => $item->code,
                    'employee_no' => $item->userCreateRequest->nip,
                    'employee_name' => $item->userCreateRequest->name,
                    'type_of_reimbursement' => $item->reimburses->first()->reimburseType->name,
                    'type_of_expense' => '-',
                    'additional_field' => '-',
                    'paid_status' => '',
                    'paid_date' => '',
                    'source' => '',
                    'cancels' => '',
                    'claim' => $item->reimburses->first()->claim_date,
                    'curency' => $item->reimburses->first()->currency,
                    'reimburses' => $item->reimburses,
                    'pr' => $item->PurchaseRequisition,
                    'request_for' => $item->user->name,
                    'remark' => $item->remark,
                    'balance' => $balance,
                    'form_count' => $item->reimburses->count(),
                    'status' => $item->status->name,
                    'request_date' => $item->created_at->format('d/m/Y'),
                ];
            });

            $filename = 'Reimburse.xlsx';
            return Excel::download(new ReimburseExport($transformedData), $filename);
        } catch (\Exception $e) {
            // Return an error response with the exception message
            return $this->errorResponse($e->getMessage());
        }
    }

    public function myReimburse()
    {
        return Inertia::render('Report/MyReimburse/Index');
    }

    public function listMyReimburse(Request $request)
    {
        try {
            $reimburseType  = isset($request->reimburse_type) && $request->reimburse_type !== "null" ? $request->reimburse_type : null;
            $employee       = isset($request->employee) && $request->employee !== "null" ? $request->employee : null;
            $family         = isset($request->family) && $request->family !== "null" ? $request->family : null;
            
            $query = MasterTypeReimburse::with([
                    'reimburses' => function ($reimburseQuery) {
                        $reimburseQuery->join('reimburse_groups as rg', 'reimburses.group', '=', 'rg.code')
                            ->whereIn('rg.status_id', [1, 3, 5])
                            ->select('reimburses.*')
                            ->with('reimburseGroup');
                    }
                ])
                ->select('master_type_reimburses.*', 'u.id as user_id', 'f.id as family_id', 'u.nip as user_nip', 'u.name as user_name', 'f.name as family_name', 
                DB::raw('
                    CASE
                        WHEN 
                            MIN(mtrua_grade_relation_exist.id) IS NULL
                            AND MIN(mtrua_grade_relation_not_exist.id) IS NOT NULL
                            AND MIN(rg.id) IS NOT NULL
                        THEN 1
                        ELSE 0
                    END AS unassign_but_has_reimburse
                ')
            )
            ->leftJoin('master_type_reimburse_grades as mtrg', 'mtrg.reimburse_type_id', '=', 'master_type_reimburses.id')
            ->leftJoin('business_trip_grades as btg', 'btg.id', '=', 'mtrg.grade_id')
            ->leftJoin('business_trip_grade_users as btgu', 'btgu.grade_id', '=', 'btg.id')
            ->leftJoin('master_type_reimburse_user_assign as mtrua_grade_relation_exist', function($join) {
                $join->on('mtrua_grade_relation_exist.user_id', '=', 'btgu.user_id')
                    ->whereColumn('mtrua_grade_relation_exist.reimburse_type_id', 'master_type_reimburses.id')
                    ->where('mtrua_grade_relation_exist.is_assign', true);
            })
            ->leftJoin('master_type_reimburse_user_assign as mtrua_grade_all_relation_exist', function($join) {
                $join->on('mtrua_grade_all_relation_exist.reimburse_type_id', 'master_type_reimburses.id')
                    ->where('grade_option', 'all');
            })
            ->leftJoin('master_type_reimburse_user_assign as mtrua_grade_relation_not_exist', function($join) {
                $join->on('mtrua_grade_relation_not_exist.reimburse_type_id', '=', 'master_type_reimburses.id')
                    ->where(function($query) {
                        $query->whereColumn('mtrua_grade_relation_not_exist.user_id', 'mtrua_grade_relation_exist.user_id')
                            ->orWhereColumn('mtrua_grade_relation_not_exist.user_id', 'mtrua_grade_all_relation_exist.user_id');
                    });
            })
            ->leftJoin('users as u', function($join) {
                $join->on('u.id', '=', 'mtrua_grade_relation_exist.user_id')
                    ->orOn('u.id', '=', 'mtrua_grade_all_relation_exist.user_id')
                    ->orOn('u.id', '=', 'mtrua_grade_relation_not_exist.user_id');
            })
            ->leftJoin('families as f', function($join) {
                $join->on('u.id', '=', 'f.userId')
                    ->where('master_type_reimburses.is_employee', false)
                    ->whereColumn('master_type_reimburses.family_status', 'f.status');
            })
            ->leftJoin('reimburses as r', function($join) {
                $join->on('r.reimburse_type', '=', 'master_type_reimburses.code')
                    ->whereColumn('r.requester', 'u.nip');
            })
            ->leftJoin('reimburse_groups as rg', function($join) {
                $join->on('rg.code', '=', 'r.group')
                    ->whereIn('rg.status_id', [1, 3, 5]);
            })
            ->where('master_type_reimburses.is_employee', true)
            ->where(function($query) {
                $query->where(function($query) {
                    $query->where('master_type_reimburses.grade_option', 'grade')
                        ->where('mtrua_grade_relation_exist.is_assign', true);
                })
                ->orWhere(function($query) {
                    $query->where('master_type_reimburses.grade_option', 'all')
                        ->where('mtrua_grade_all_relation_exist.is_assign', true);
                })
                ->orWhere(function($query) {
                    $query->whereNot('mtrua_grade_relation_not_exist.is_assign', true)
                        ->whereNotNull('rg.id');
                });
            })
            ->orWhere(function($query) {
                    $query->where(function($query) {
                        $query->where('master_type_reimburses.is_employee', false)
                            ->whereNotNull('f.id');
                    });
            });
            
            $orderBy = $request->sort_by == 'id' ? 'master_type_reimburses.name' : $request->sort_by;
            $sortBy = $request->sort_by == 'id' ? 'asc' : $request->sort_direction;
            $query->groupBy(['master_type_reimburses.id', 'u.id', 'f.id']);
            $query->orderBy($orderBy, $sortBy);

            if ($reimburseType !== null) $query = $query->having('master_type_reimburses.code', $reimburseType);
            if ($employee !== null) $query = $query->having('u.id', $employee);
            if ($family !== null) $query = $query->having('f.id', $family);

            $perPage = $request->get('per_page', 10);
            $queryResult = $query->paginate($perPage);
            
            $queryResult->getCollection()->each(function ($masterTypeReimburse) {
                $masterTypeReimburse->load([
                    'reimburseTypeGrades.grade.gradeUsers.reimburseTypeAssignUsers' => function ($assignQuery) use ($masterTypeReimburse) {
                        $assignQuery->where([
                            'reimburse_type_id' => $masterTypeReimburse->id,
                            'is_assign' => true
                        ]);
                    },
                    'reimburseTypeUserAssign' => function ($assignQuery) use ($masterTypeReimburse) {
                        $assignQuery->where([
                            'reimburse_type_id' => $masterTypeReimburse->id,
                            'is_assign' => true
                        ]);
                    }
                ]);
            });
            
            $queryResult->getCollection()->transform(function ($map, $key) {
                $map = json_decode($map);

                // Balance Plafon
                if ($map->grade_option == 'grade' && count($map->reimburse_type_grades) > 0) {
                    $maximumBalance = collect($map->reimburse_type_grades)
                        ->filter(function ($reimburseTypeGrade) use ($map) {
                            return isset($reimburseTypeGrade->grade) &&
                                !empty($reimburseTypeGrade->grade->grade_users) &&
                                collect($reimburseTypeGrade->grade->grade_users)
                                    ->contains('user_id', $map->user_id);
                        })
                        ->pluck('plafon')
                        ->first();
                } else {
                    $maximumBalance = $map->grade_all_price;
                }
                
                $for        = $map->is_employee == true ? 'reimburses.requester' : 'reimburses.for';
                $forValue   = $map->is_employee == true ? $map->user_nip : $map->family_id;
                // Total Balance Requested
                $getBalanceOnPr = Reimburse::selectRaw("
                    reimburses.balance as balance, 
                    mtr.interval_claim_period as has_interval_claim, 
                    pr.is_closed as status_closed,
                    pr.clearing_status as clearing_status,
                    pr.status as pr_status,
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
                        ->where('reimburses.item_number', '=', DB::raw('CAST(pr.item_number AS BIGINT)'));
                })
                ->where(function ($query) use ($map, $for, $forValue) {
                    $query->where($for, $forValue)
                        ->where('reimburses.reimburse_type', $map->code)
                        ->where('pr.code_transaction', 'REIM')
                        ->whereIn('rg.status_id', [1, 3, 5]);
                })
                ->orWhere(function ($query) use ($map, $for, $forValue) {
                    $query->where($for, $forValue)
                        ->where('reimburses.reimburse_type', $map->code)
                        ->whereNull('pr.code_transaction')
                        ->whereIn('rg.status_id', [1, 3, 5]);
                })->get()->toArray();

                $unpaidBalance = array_sum(array_column(array_filter($getBalanceOnPr, function ($value) { return ($value['clearing_status'] != 'S' && $value['pr_status'] != 'X') && (($value['has_interval_claim'] !== null && $value['on_interval'] == 1) || $value['has_interval_claim'] == null); }), 'balance'));
                $paidBalance = array_sum(array_column(array_filter($getBalanceOnPr, function ($value) { return ($value['clearing_status'] == 'S' && $value['status_closed'] == 'S' && $value['pr_status'] != 'X') && (($value['has_interval_claim'] !== null && $value['on_interval'] == 1) || $value['has_interval_claim'] == null); }), 'balance'));

                // Remaining Balance
                $remainingBalance = $map->unassign_but_has_reimburse == 1 ? 0 : (int)$maximumBalance - ($paidBalance + $unpaidBalance);
            
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
                    'id'                            => $key + 1,
                    'reimburse_type_name'           => $map->name .' ('.$map->code.')',
                    'user_name'                     => ucwords($map->user_name),
                    'familiy_name'                  => ucwords($map->family_name),
                    'is_employee'                   => $map->is_employee,
                    'family_status'                 => ucwords($map->family_status),
                    'interval_claim_period'         => $map->interval_claim_period ?  $map->interval_claim_period / 365 . ' Year' : '-',
                    'currency'                      => 'IDR',
                    'maximumBalance'                => (int)$maximumBalance,
                    'remainingBalance'              => $remainingBalance,
                    'lastClaimDate'                 => $lastClaimDate,
                    'availableClaimDate'            => $availableClaimDate,
                    'totalPaid'                     => $paidBalance,
                    'totalUnpaid'                   => $unpaidBalance
                ];
            
                // if ($isEmployee == false) $return['family_status'] = ucwords($map->family_status);
            
                return $return;
            });

            return $this->successResponse($queryResult);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function exportMyReimburse(Request $request)
    {
        try {
            $reimburseType  = isset($request->reimburse_type) && $request->reimburse_type !== "null" ? $request->reimburse_type : null;
            $employee       = isset($request->employee) && $request->employee !== "null" ? $request->employee : null;
            $family         = isset($request->family) && $request->family !== "null" ? $request->family : null;

            $query = MasterTypeReimburse::with([
                    'reimburses' => function ($reimburseQuery) {
                        $reimburseQuery->join('reimburse_groups as rg', 'reimburses.group', '=', 'rg.code')
                            ->whereIn('rg.status_id', [1, 3, 5])
                            ->select('reimburses.*')
                            ->with('reimburseGroup');
                    }
                ])
                ->select('master_type_reimburses.*', 'u.id as user_id', 'f.id as family_id', 'u.nip as user_nip', 'u.name as user_name', 'f.name as family_name', 
                DB::raw('
                    CASE
                        WHEN 
                            MIN(mtrua_grade_relation_exist.id) IS NULL
                            AND MIN(mtrua_grade_relation_not_exist.id) IS NULL
                            AND MIN(rg.id) IS NOT NULL
                        THEN 1
                        ELSE 0
                    END AS unassign_but_has_reimburse
                ')
            )
            ->leftJoin('master_type_reimburse_grades as mtrg', 'mtrg.reimburse_type_id', '=', 'master_type_reimburses.id')
            ->leftJoin('business_trip_grades as btg', 'btg.id', '=', 'mtrg.grade_id')
            ->leftJoin('business_trip_grade_users as btgu', 'btgu.grade_id', '=', 'btg.id')
            ->leftJoin('master_type_reimburse_user_assign as mtrua_grade_relation_exist', function($join) {
                $join->on('mtrua_grade_relation_exist.user_id', '=', 'btgu.user_id')
                    ->whereColumn('mtrua_grade_relation_exist.reimburse_type_id', 'master_type_reimburses.id')
                    ->where('mtrua_grade_relation_exist.is_assign', true);
            })
            ->leftJoin('master_type_reimburse_user_assign as mtrua_grade_all_relation_exist', function($join) {
                $join->on('mtrua_grade_all_relation_exist.reimburse_type_id', 'master_type_reimburses.id')
                    ->where('grade_option', 'all');
            })
            ->leftJoin('master_type_reimburse_user_assign as mtrua_grade_relation_not_exist', function($join) {
                $join->on('mtrua_grade_relation_not_exist.reimburse_type_id', '=', 'master_type_reimburses.id')
                    ->where(function($query) {
                        $query->whereColumn('mtrua_grade_relation_not_exist.user_id', 'mtrua_grade_relation_exist.user_id')
                            ->orWhereColumn('mtrua_grade_relation_not_exist.user_id', 'mtrua_grade_all_relation_exist.user_id');
                    });
            })
            ->leftJoin('users as u', function($join) {
                $join->on('u.id', '=', 'mtrua_grade_relation_exist.user_id')
                    ->orOn('u.id', '=', 'mtrua_grade_all_relation_exist.user_id')
                    ->orOn('u.id', '=', 'mtrua_grade_relation_not_exist.user_id');
            })
            ->leftJoin('families as f', function($join) {
                $join->on('u.id', '=', 'f.userId')
                    ->where('master_type_reimburses.is_employee', false)
                    ->whereColumn('master_type_reimburses.family_status', 'f.status');
            })
            ->leftJoin('reimburses as r', function($join) {
                $join->on('r.reimburse_type', '=', 'master_type_reimburses.code')
                    ->whereColumn('r.requester', 'u.nip');
            })
            ->leftJoin('reimburse_groups as rg', function($join) {
                $join->on('rg.code', '=', 'r.group')
                    ->whereIn('rg.status_id', [1, 3, 5]);
            })
            ->where('master_type_reimburses.is_employee', true)
            ->where(function($query) {
                $query->where(function($query) {
                    $query->where('master_type_reimburses.grade_option', 'grade')
                        ->where('mtrua_grade_relation_exist.is_assign', true);
                })
                ->orWhere(function($query) {
                    $query->where('master_type_reimburses.grade_option', 'all')
                        ->where('mtrua_grade_all_relation_exist.is_assign', true);
                })
                ->orWhere(function($query) {
                    $query->whereNot('mtrua_grade_relation_not_exist.is_assign', true)
                        ->whereNotNull('rg.id');
                });
            })
            ->orWhere(function($query) {
                    $query->where(function($query) {
                        $query->where('master_type_reimburses.is_employee', false)
                            ->whereNotNull('f.id');
                    });
            });

            
            $query->groupBy(['master_type_reimburses.id', 'u.id', 'f.id']);
            $orderBy = $request->sort_by == 'id' ? 'master_type_reimburses.name' : $request->sort_by;
            $sortBy = $request->sort_by == 'id' ? 'asc' : $request->sort_direction;
            $query->orderBy($orderBy, $sortBy);

            if ($reimburseType !== null) $query = $query->having('master_type_reimburses.code', $reimburseType);
            if ($employee !== null) $query = $query->having('u.id', $employee);
            if ($family !== null) $query = $query->having('f.id', $family);

            $queryResult = $query->get();

            $queryResult->each(function ($masterTypeReimburse) {
                $masterTypeReimburse->load([
                    'reimburseTypeGrades.grade.gradeUsers.reimburseTypeAssignUsers' => function ($assignQuery) use ($masterTypeReimburse) {
                        $assignQuery->where([
                            'reimburse_type_id' => $masterTypeReimburse->id,
                            'is_assign' => true
                        ]);
                    },
                    'reimburseTypeUserAssign' => function ($assignQuery) use ($masterTypeReimburse) {
                        $assignQuery->where([
                            'reimburse_type_id' => $masterTypeReimburse->id,
                            'is_assign' => true
                        ]);
                    }
                ]);
            });
            
            // Transform data for export
            $transformedData = $queryResult->map(function ($item) {
                $maximumBalance = $item->grade_option == 'grade' && count($item->reimburseTypeGrades) > 0
                    ? collect($item->reimburseTypeGrades)
                        ->filter(function ($reimburseTypeGrade) use ($item) {
                            return isset($reimburseTypeGrade->grade) &&
                                !empty($reimburseTypeGrade->grade->gradeUsers) &&
                                collect($reimburseTypeGrade->grade->gradeUsers)
                                    ->contains('user_id', $item->user_id);
                        })
                        ->pluck('plafon')
                        ->first()
                    : $item->grade_all_price;
                
                $for = $item->is_employee == true ? 'reimburses.requester' : 'reimburses.for';
                $forValue = $item->is_employee == true ? $item->user_nip : $item->family_id;
                
                // Total Balance Requested
                $getBalanceOnPr = Reimburse::selectRaw("
                    reimburses.balance as balance, 
                    mtr.interval_claim_period as has_interval_claim, 
                    pr.is_closed as status_closed,
                    pr.clearing_status as clearing_status,
                    pr.status as pr_status,
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
                        ->where('reimburses.item_number', '=', DB::raw('CAST(pr.item_number AS BIGINT)'));
                })
                ->where(function ($query) use ($item, $for, $forValue) {
                    $query->where($for, $forValue)
                        ->where('reimburses.reimburse_type', $item->code)
                        ->where('pr.code_transaction', 'REIM')
                        ->whereIn('rg.status_id', [1, 3, 5]);
                })
                ->orWhere(function ($query) use ($item, $for, $forValue) {
                    $query->where($for, $forValue)
                        ->where('reimburses.reimburse_type', $item->code)
                        ->whereNull('pr.code_transaction')
                        ->whereIn('rg.status_id', [1, 3, 5]);
                })->get()->toArray();

                $unpaidBalance = array_sum(array_column(array_filter($getBalanceOnPr, function ($value) {
                    return ($value['clearing_status'] != 'S' && $value['pr_status'] != 'X') &&
                        (($value['has_interval_claim'] !== null && $value['on_interval'] == 1) || $value['has_interval_claim'] == null);
                }), 'balance'));

                $paidBalance = array_sum(array_column(array_filter($getBalanceOnPr, function ($value) {
                    return ($value['clearing_status'] == 'S' && $value['status_closed'] == 'S' && $value['pr_status'] != 'X') &&
                        (($value['has_interval_claim'] !== null && $value['on_interval'] == 1) || $value['has_interval_claim'] == null);
                }), 'balance'));

                // Remaining Balance
                $remainingBalance = $item->unassign_but_has_reimburse == 1 ? 0 : (int)$maximumBalance - ($paidBalance + $unpaidBalance);

                // Last Claim Date
                $lastClaimDate = collect($item->reimburses)->isNotEmpty() ? 
                    collect($item->reimburses)->max('claim_date') : null;

                // Available Claim Date
                $availableClaimDate = $item->interval_claim_period == null || $lastClaimDate == null
                    ? null
                    : Carbon::createFromFormat('Y-m-d', $lastClaimDate)->addDays((int)$item->interval_claim_period);

                return [
                    'reimburseType'         => $item->name,
                    'employeeName'          => $item->user_name,
                    'familyName'            => $item->family_name,
                    'isEmployee'            => $item->is_employee,
                    'familyStatus'          => ucwords($item->family_status),
                    'intervalClaimPeriod'   => $item->interval_claim_period ?  $item->interval_claim_period / 365 . ' Year' : '-',
                    'currency'              => 'IDR',
                    'maiximumBalance'       => (int)$maximumBalance,
                    'remainingBalance'      => $remainingBalance,
                    'lastClaimDate'         => $lastClaimDate,
                    'availableClaimDate'    => $availableClaimDate,
                    'totalPaid'             => $paidBalance,
                    'totalUnpaid'           => $unpaidBalance,
                ];
            });

            $filename = 'MyReimburseReport.xlsx';
            return Excel::download(new MyReimburseExport($transformedData), $filename);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function businessTrip()
    {
        return Inertia::render('Report/BusinessTrip/index');
    }

    public function listBT(Request $request)
    {

        $query =  BusinessTrip::query()->with(['purposeType', 'status', 'businessTripDestination', 'requestFor']);
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');

        // $query->orderBy($sortBy, $sortDirection);
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)->where('document_name', 'TRIP')->pluck('document_id')->toArray();
            $query = $query->whereIn('id', $data);
        }
        if (Auth::user()->is_admin != '1') {
            $query = $query->where('created_by', Auth::user()->id)
                ->orWhere('request_for', Auth::user()->id);
        }

        if ($startDate && $endDate) {
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
        }
        if ($status) {
            $query->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($destination) {
            $query->whereHas('businessTripDestination', function ($q) use ($destination) {
                $q->where('destination', $destination);
            });
        }

        if ($type) {
            $query->whereHas('purposeType', function ($q) use ($type) {
                $q->where('id', $type);
            });
        }

        if ($department) {
            $query->whereHas('requestFor', function ($q) use ($department) {
                $q->where('departement_id', $department);
            });
        }

        $data = $query->where('type', 'request')->latest()->search(request(['search']))->paginate($perPage);

        $data->getCollection()->transform(function ($map) {

            $purposeRelations = $map->purposeType ? $map->purposeType->name : ''; // Assuming 'name' is the field

            return [
                'id' => $map->id,
                'status_id' => $map->status_id,
                'request_no' => $map->request_no,
                'remarks' => $map->remarks,
                'request_for' => $map->requestFor->name,
                'status' => [
                    'name' => $map->status->name,
                    'classname' => $map->status->classname,
                    'code' => $map->status->code
                ],
                'purpose_type' => $purposeRelations, // You can join multiple relations here if it's an array
                'total_destination' => $map->total_destination, // You can join multiple relations here if it's an array
                'created_at' => date('d/m/Y', strtotime($map->created_at)),
            ];
        });

        return $this->successResponse($data);
    }

    public function exportBT(Request $request)
    {
        $query = BusinessTrip::query()->with(['purposeType', 'status', 'requestFor', 'businessTripDestination', 'requestedBy', 'requestedBy.positions', 'requestedBy.divisions', 'requestedBy.departements']);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');


        if ($startDate && $endDate) {
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
        }
        if ($status) {
            $query->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($type) {
            $query->whereHas('purposeType', function ($q) use ($type) {
                $q->where('id', $type);
            });
        }

        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)
                ->where('document_name', 'TRIP')
                ->pluck('document_id')
                ->toArray();
            $query = $query->whereIn('id', $data);
        }
        if (Auth::user()->is_admin != '1') {
            $query = $query->where('created_by', Auth::user()->id)
                ->orWhere('request_for', Auth::user()->id);
        }
        if ($destination) {
            $query->whereHas('businessTripDestination', function ($q) use ($destination) {
                $q->where('destination', $destination);
            });
        }

        if ($department) {
            $query->whereHas('requestFor', function ($q) use ($department) {
                $q->where('departement_id', $department);
            });
        }

        $data = $query->where('type', 'request')
            ->latest()
            ->search(request(['search']))
            ->get();

        // Transform the data for export
        $transformedData = $data->map(function ($businessTrip) {
            $destinations = collect($businessTrip->businessTripDestination ?? [])->map(function ($destination) {
                $allowanceItemsDay = collect($destination->detailDestinationDay ?? [])->map(function ($allowanceItem) {
                    $allowance = optional($allowanceItem->allowance);
                    return [
                        'item_name' => $allowance->name ? $allowance->name . ' [DAY]' : 'Unknown [DAY]',
                        'amount' => (int) ($allowanceItem->price ?? 0),
                        'currency_id' => $allowance->currency_id ?? '',
                    ];
                });

                $allowanceItemsTotal = collect($destination->detailDestinationTotal ?? [])->map(function ($allowanceItem) {
                    $allowance = optional($allowanceItem->allowance);
                    return [
                        'item_name' => $allowance->name ? $allowance->name . ' [TOTAL]' : 'Unknown [TOTAL]',
                        'amount' => (int) ($allowanceItem->price ?? 0),
                        'currency_id' => $allowance->currency_id ?? '',
                    ];
                });

                $allAllowanceItems = $allowanceItemsDay->merge($allowanceItemsTotal);

                return [
                    'destination' => $destination->destination ?? '',
                    'start_date' => $destination->business_trip_start_date ?? '',
                    'end_date' => $destination->business_trip_end_date ?? '',
                    'allowance_items' => $allAllowanceItems,
                    'total_allowance' => $allAllowanceItems->sum('amount') ?? 0,
                ];
            });

            return [
                'requestDate' => $businessTrip->created_at ?? '',
                'requestedBy' => $businessTrip->requestedBy ?? '',
                'requestFor' => $businessTrip->requestFor ?? '',
                'requestNo' => $businessTrip->request_no ?? '',
                'status' => $businessTrip->status ?? '',
                'purposeType' => $businessTrip->purposeType ?? '',
                'remarks' => $businessTrip->remarks ?? '',
                'destinations' => $destinations,
            ];
        });


        // Return the exported file
        $filename = 'BusinessTrips.xlsx';
        return Excel::download(new BusinessTripExport($transformedData), $filename);
    }

    public function businessTripDec()
    {
        return Inertia::render('Report/BusinessTripDeclaration/index');
    }

    public function listBTDec(Request $request)
    {

        $query =  BusinessTrip::query()->with(['purposeType', 'status', 'requestFor']);
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');

        // $query->orderBy($sortBy, $sortDirection);
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)
                ->where('document_name', 'TRIP_DECLARATION')->pluck('document_id')->toArray();
            $query = $query->whereIn('id', $data);
        }
        if (Auth::user()->is_admin != '1') {
            $query = $query->where('created_by', Auth::user()->id)
                ->orWhere('request_for', Auth::user()->id);
        }
        if ($startDate && $endDate) {
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
        }
        if ($status) {
            $query->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($type) {
            $query->whereHas('purposeType', function ($q) use ($type) {
                $q->where('id', $type);
            });
        }
        if ($destination) {
            $query->whereHas('businessTripDestination', function ($q) use ($destination) {
                $q->where('destination', $destination);
            });
        }

        if ($department) {
            $query->whereHas('requestFor', function ($q) use ($department) {
                $q->where('departement_id', $department);
            });
        }


        $data = $query->where('type', 'declaration')->latest()->search(request(['search']))->paginate($perPage);

        $data->getCollection()->transform(function ($map) {

            // $purposeRelations = $map->purposeType ? $map->purposeType->name : '';
            $requestFor = $map->requestFor ? $map->requestFor->name : '';
            $requestNo = $map->parentBusinessTrip ? $map->parentBusinessTrip->request_no : '';

            return [
                'id' => $map->id,
                'declaration_no' => $map->request_no,
                'request_no' => $requestNo,
                'request_for' => $requestFor,
                'remarks' => $map->remarks,
                'status' => [
                    'name' => $map->status->name,
                    'classname' => $map->status->classname,
                    'code' =>
                    $map->status->code
                ],
                'created_at' => date('d/m/Y', strtotime($map->created_at)),
                // 'purpose_type' => $purposeRelations, // You can join multiple relations here if it's an array
                // 'total_destination' => $map->total_destination, // You can join multiple relations here if it's an array
            ];
        });


        return $this->successResponse($data);
    }

    public function exportBTDec(Request $request)
    {
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');


        $query = BusinessTrip::query()->with(['purposeType', 'status', 'requestFor', 'parentBusinessTrip', 'businessTripDestination']);

        // Check approval filter
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)
                ->where('document_name', 'TRIP_DECLARATION')
                ->pluck('document_id')
                ->toArray();

            $query = $query->whereIn('id', $data);
        }
        if (Auth::user()->is_admin != '1') {
            $query = $query->where('created_by', Auth::user()->id)
                ->orWhere('request_for', Auth::user()->id);
        }
        if ($startDate && $endDate) {
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
        }
        if ($status) {
            $query->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($type) {
            $query->whereHas('purposeType', function ($q) use ($type) {
                $q->where('id', $type);
            });
        }

        if ($destination) {
            $query->whereHas('businessTripDestination', function ($q) use ($destination) {
                $q->where('destination', $destination);
            });
        }

        if ($department) {
            $query->whereHas('requestFor', function ($q) use ($department) {
                $q->where('departement_id', $department);
            });
        }

        // Filter for type declaration
        $data = $query->where('type', 'declaration')->latest()->search(request(['search']))->get();

        // Transform the data for export
        $transformedData = $data->map(function ($businessTrip) {
            $destinations = collect($businessTrip->businessTripDestination ?? [])->map(function ($destination) {
                $allowanceItemsDay = collect($destination->detailDestinationDay ?? [])->map(function ($allowanceItem) {
                    $allowance = $allowanceItem->allowance ?? null;
                    return [
                        'item_name' => $allowance ? ($allowance->name . ' [DAY]') : 'Unknown [DAY]',
                        'amount' => (int) ($allowanceItem->price ?? 0),
                        'currency_id' => $allowance->currency_id ?? '',
                    ];
                });

                $allowanceItemsTotal = collect($destination->detailDestinationTotal ?? [])->map(function ($allowanceItem) {
                    $allowance = $allowanceItem->allowance ?? null;
                    return [
                        'item_name' => $allowance ? ($allowance->name . ' [TOTAL]') : 'Unknown [TOTAL]',
                        'amount' => (int) ($allowanceItem->price ?? 0),
                        'currency_id' => $allowance->currency_id ?? '',
                    ];
                });

                $allAllowanceItems = $allowanceItemsDay->merge($allowanceItemsTotal);

                return [
                    'destination' => $destination->destination ?? '',
                    'start_date' => $destination->business_trip_start_date ?? '',
                    'end_date' => $destination->business_trip_end_date ?? '',
                    'allowance_items' => $allAllowanceItems,
                    'total_allowance' => $allAllowanceItems->sum('amount') ?? 0,
                ];
            });

            return [
                'requestDate' => $businessTrip->created_at ?? '',
                'requestedBy' => $businessTrip->requestedBy ?? '',
                'requestFor' => $businessTrip->requestFor ?? '',
                'requestNo' => $businessTrip->request_no ?? '',
                'status' => $businessTrip->status ?? '',
                'purposeType' => $businessTrip->purposeType ?? '',
                'remarks' => $businessTrip->remarks ?? '',
                'destinations' => $destinations,
            ];
        });

        $filename = 'BusinessTripDeclarations.xlsx';
        return Excel::download(new BusinessTripDeclarationExport($transformedData), $filename);
    }

    public function businessTripOverall()
    {
        return Inertia::render('Report/BusinessTripOverall/index');
    }

    public function listBTOverall(Request $request)
    {

        $query = BusinessTrip::query()->with(['purposeType', 'status', 'businessTripDestination', 'requestFor', 'requestedBy', 'requestReferenceDeclaration'])
            ->where('type', 'request')
            ->where('status_id', 3);
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');

        // $query->orderBy($sortBy, $sortDirection);
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)->where('document_name', 'TRIP')->pluck('document_id')->toArray();
            $query = $query->whereIn('id', $data);
        }
        if (Auth::user()->is_admin != '1') {
            $query = $query->where('created_by', Auth::user()->id)
                ->orWhere('request_for', Auth::user()->id);
        }

        if ($startDate && $endDate) {
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
        }

        if ($destination) {
            $query->whereHas('businessTripDestination', function ($q) use ($destination) {
                $q->where('destination', $destination);
            });
        }

        if ($type) {
            $query->whereHas('purposeType', function ($q) use ($type) {
                $q->where('id', $type);
            });
        }

        if ($department) {
            $query->whereHas('requestFor', function ($q) use ($department) {
                $q->where('departement_id', $department);
            });
        }

        $data = $query->latest()->search(request(['search']))->paginate($perPage);

        $data->getCollection()->transform(function ($map) {
            $purposeRelations = $map->purposeType ? $map->purposeType->name : ''; // Assuming 'name' is the field
            
            return [
                'id' => $map->id,
                'status_id' => $map->status_id,
                'request_no' => $map->request_no,
                'parent_request_no' => optional($map->requestReferenceDeclaration)->request_no ?? '',
                'parent_request_status' => optional($map->requestReferenceDeclaration)->status ?? 0,
                'remarks' => $map->remarks,
                'request_for' => $map->requestFor->name ?? '',
                'employee_no' => $map->requestedBy->nip,
                'employee_name' => $map->requestedBy->name ?? '',
                'position' => $map->requestedBy->positions->name ?? '',
                'dept' => $map->requestedBy->departements->name ?? '',
                'division' => $map->requestedBy->divisions->name ?? '',
                'status' => [
                    'name' => $map->status->name,
                    'classname' => $map->status->classname,
                    'code' => $map->status->code
                ],
                'purpose_type' => $purposeRelations, // You can join multiple relations here if it's an array
                'total_destination' => $map->total_destination, // You can join multiple relations here if it's an array
                'created_at' => date('d/m/Y', strtotime($map->created_at)),
            ];
        });

        return $this->successResponse($data);
    }

    public function exportBTOverall(Request $request)
    {
        $query = BusinessTrip::query()->with(['purposeType', 'status', 'requestFor', 'requestReferenceDeclaration', 'businessTripDestination', 'requestedBy', 'requestedBy.positions', 'requestedBy.divisions', 'requestedBy.departements'])
            ->where('type', 'request')
            ->where('status_id', 3);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');

        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)
                ->where('document_name', 'TRIP')
                ->pluck('document_id')
                ->toArray();
            $query = $query->whereIn('id', $data);
        }
        if (Auth::user()->is_admin != '1') {
            $query = $query->where('created_by', Auth::user()->id)
                ->orWhere('request_for', Auth::user()->id);
        }

        if ($startDate && $endDate) {
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
        }
        if ($status) {
            $query->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($type) {
            $query->whereHas('purposeType', function ($q) use ($type) {
                $q->where('id', $type);
            });
        }

        if ($destination) {
            $query->whereHas('businessTripDestination', function ($q) use ($destination) {
                $q->where('destination', $destination);
            });
        }

        if ($department) {
            $query->whereHas('requestFor', function ($q) use ($department) {
                $q->where('departement_id', $department);
            });
        }

        $data = $query->latest()->search(request(['search']))->get();

        // Transform data
        $transformedData = $data->map(function ($businessTrip) {
            $isDeclaration = $businessTrip->type === 'declaration';

            return [
                'type' => $businessTrip->type ?? '',
                'employee' => $businessTrip->requestFor ?? '',
                'requested_by' => $businessTrip->requestedBy ?? '',
                'request_no' => $businessTrip->request_no ?? '',
                'status' => $businessTrip->status ?? '',
                'purpose' => $businessTrip->purposeType ?? '',
                'remarks' => $businessTrip->remarks ?? '',
                'is_declaration' => $isDeclaration,
                'parent_request_no' => optional($businessTrip->requestReferenceDeclaration)->request_no ?? '',
                'parent_request_status' => optional($businessTrip->requestReferenceDeclaration)->status ?? 0,
                'destinations' => optional($businessTrip->businessTripDestination)->map(function ($destination) use ($isDeclaration) {
                    return [
                        'start_date' => $destination->business_trip_start_date ?? '',
                        'end_date' => $destination->business_trip_end_date ?? '',
                        'destination' => $destination->destination ?? '',
                        'date' => $isDeclaration ? ($destination->created_at ?? '') : ($destination->business_trip_start_date ?? ''),
                        'allowances' => optional($destination->detailDestinationTotal)->map(function ($item) {
                            return [
                                'item_name' => optional($item->allowance)->name ?? '',
                                'amount' => $item->price ?? 0
                            ];
                        }) ?? [],
                        'total' => optional($destination->detailDestinationTotal)->sum('price') ?? 0
                    ];
                }) ?? []
            ];
        });
        // Return the exported file
        $filename = 'BusinessTripOverall.xlsx';
        return Excel::download(new BusinessTripOverallExport($transformedData), $filename);
    }


    public function purchase(Request $request)
    {
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $vendor = $request->get('vendor');
        $department = $request->get('department');
        $userData = false;
        $filterableColumns = [
            'user_id',
            'document_type',
            'purchasing_groups',
            'delivery_date',
            'storage_locations',
            'total_vendor',
            'total_item',
            'purchases_number',
        ];

        $data = Purchase::with('status', 'updatedBy', 'createdBy', 'user', 'vendors', 'purchaseRequisitions');

        $hasColumns =  [
            [
                "join" => "user",
                "column" => "name",
            ],
            [
                "join" => "createdBy",
                "column" => "name",
            ],
            [
                "join" => "updatedBy",
                "column" => "name",
            ],
            [
                "join" => "status",
                "column" => "name",
            ],
            [
                "join" => "purchaseRequisitions",
                "column" => "purchase_requisition_number",
            ],
            [
                "join" => "purchaseRequisitions",
                "column" => "no_po",
            ],
        ];

        if ($startDate && $endDate) {
            $data->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
        }
        if ($status) {
            $data->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($type) {
            $data->where('document_type', $type);
        }

        if ($vendor) {
            $data->whereHas('vendors', function ($q) use ($vendor) {
                $q->where('id', $vendor);
            });
        }
        if ($department) {
            $data->whereHas('user', function ($q) use ($department) {
                $q->where('departement_id', $department);
            });
        }
        if (Auth::user()->is_admin != '1') {
            $userData = true;
        }

        $data = $this->filterAndPaginateHasJoin($request, $data, $filterableColumns,  $hasColumns, $userData);
        return $this->successResponse($data);
    }

    public function purchaseExport(Request $request)
    {
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $status = $request->get('status');
        $type = $request->get('type');
        $vendor = $request->get('vendor');
        $department = $request->get('department');
        $userData = false;

        $filterableColumns = [
            'user_id',
            'document_type',
            'purchasing_groups',
            'delivery_date',
            'storage_locations',
            'total_vendor',
            'total_item',
            'purchases_number',
        ];

        $hasColumns =  [
            [
                "join" => "user",
                "column" => "name",
            ],
            [
                "join" => "createdBy",
                "column" => "name",
            ],
            [
                "join" => "updatedBy",
                "column" => "name",
            ],
            [
                "join" => "status",
                "column" => "name",
            ],
            [
                "join" => "purchaseRequisitions",
                "column" => "purchase_requisition_number",
            ],
            [
                "join" => "purchaseRequisitions",
                "column" => "no_po",
            ],
            [
                "join" => "vendorsWinner",
                "column" => "name",
            ],
            [
                "join" => "cashAdvancePurchases",
                "column" => "reference",
            ],
        ];


        $data = Purchase::with('status', 'updatedBy', 'createdBy', 'user', 'vendors', 'purchaseRequisitions', 'vendorsWinner', 'cashAdvancePurchases');
        if ($startDate && $endDate) {
            $data->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
        }
        if ($status) {
            $data->whereHas('status', function ($q) use ($status) {
                $q->where('code', $status);
            });
        }
        if ($type) {
            $data->where('document_type', $type);
        }
        if ($vendor) {
            $data->whereHas('vendors', function ($q) use ($vendor) {
                $q->where('vendor', $vendor);
            });
        }
        if ($department) {
            $data->whereHas('user', function ($q) use ($department) {
                $q->where('departement_id', $department);
            });
        }

        if (Auth::user()->is_admin != '1') {
            $userData = true;
        }

        $data = $this->filterAndNotPaginateHasJoin($request, $data, $filterableColumns, $hasColumns, $userData);

        $transformedData = $data->map(function ($pr) {
            return [
                'po_no' => collect($pr->purchaseRequisitions)->firstWhere('no_po', '!=', null)->no_po ?? '-',
                'pr_no' => $pr->purchases_number ?? '',
                'quatation_no' => optional($pr->vendorsWinner)->quotation ?? '',
                'requested_by' => optional($pr->user)->name ?? '',
                'requester' => optional($pr->getRelationValue('createdBy'))->name ?? '',
                'document_type' => $pr->document_type ?? '',
                'purchasing_groups' => $pr->purchasing_groups ?? '',
                'cost_center' => collect($pr->purchaseRequisitions)->firstWhere('cost_center', '!=', null)->cost_center ?? '-',
                'delivery_date' => $pr->delivery_date ?? '',
                'storage_locations' => $pr->storage_locations ?? '',
                'header_note' => collect($pr->purchaseRequisitions)->firstWhere('header_not', '!=', null)->header_not ?? '-',

                // Entertainment
                'tanggal_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('tanggal_entertainment', '!=', null)->tanggal_entertainment ?? '-',
                'tempat_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('tempat_entertainment', '!=', null)->tempat_entertainment ?? '-',
                'alamat_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('alamat_entertainment', '!=', null)->alamat_entertainment ?? '-',
                'jenis_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('jenis_entertainment', '!=', null)->jenis_entertainment ?? '-',
                'nama_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('nama_entertainment', '!=', null)->nama_entertainment ?? '-',
                'posisi_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('posisi_entertainment', '!=', null)->posisi_entertainment ?? '-',
                'nama_perusahaan' => collect($pr->purchaseRequisitions)->firstWhere('nama_perusahaan', '!=', null)->nama_perusahaan ?? '-',
                'jenis_usaha_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('jenis_usaha_entertainment', '!=', null)->jenis_usaha_entertainment ?? '-',
                'jenis_kegiatan_entertainment' => collect($pr->purchaseRequisitions)->firstWhere('jenis_kegiatan_entertainment', '!=', null)->jenis_kegiatan_entertainment ?? '-',

                'status' => optional($pr->status)->name ?? '',
                'number_pr' => collect($pr->purchaseRequisitions)->firstWhere('purchase_requisition_number', '!=', null)->purchase_requisition_number ?? '-',
                'status_pr' => collect($pr->purchaseRequisitions)->firstWhere('status', '!=', null)->status ?? '-',
                'status_po' => collect($pr->purchaseRequisitions)->firstWhere('is_closed', '!=', null)->is_closed ?? '-',
                'currency' => collect($pr->purchaseRequisitions)->firstWhere('currency', '!=', null)->currency ?? '-',
                'attachment' => collect($pr->purchaseRequisitions)->pluck('attachment')->filter()->implode(','),
                'created_at' => $pr->created_at ?? '',
                'total_vendor' => $pr->total_vendor ?? '',
                'propose_vendor' => optional($pr->vendorsWinner?->masterBusinesPartnerss)->name_one ?? '',

                // Item detail dari relasi vendorsWinner.units (hasMany)
                'items' => optional($pr->vendorsWinner)->units->map(function ($unit) {
                    $qty = $unit->qty ?? 0;
                    $unit_price = $unit->unit_price ?? 0;
                    return [
                        'request_date' => $unit->requisition_date ?? '',
                        'qty' => $qty,
                        'unit_price' => $unit_price,
                        'total_amount' => $qty * $unit_price, // Menghitung total amount
                        'account_assignment' => $unit->account_assignment_categories ?? '',
                        'material_group' => $unit->material_group ?? '',
                        'material_number' => $unit->material_number ?? '',
                        'uom' => $unit->uom ?? '',
                        'tax' => $unit->tax ?? '',
                        'short_text' => $unit->short_text ?? '',
                    ];
                })->toArray(),

                // Cash advanced
                'is_cashAdvance' => $pr->is_cashAdvance ?? '',
                'amount' => optional($pr->cashAdvancePurchases)->nominal ?? '0',
                'percentage' => optional($pr->cashAdvancePurchases)->dp ?? '',
                'reference' => optional($pr->cashAdvancePurchases)->reference ?? '',
            ];
        });

        $filename = 'Purchase.xlsx';
        return Excel::download(new PurchaseRequisitionExport($transformedData), $filename);
        return $this->successResponse($data);
    }

    public function purchaseTypes(Request $request)
    {
        $data = DocumentType::select('id', 'purchasing_doc')->get();
        return $this->successResponse($data);
    }

    public function departments(Request $request)
    {
        $data = MasterDepartment::select('id', 'name')->get();
        return $this->successResponse($data);
    }

    public function statuses(Request $request)
    {
        $data = MasterStatus::select('code', 'name')->get();
        return $this->successResponse($data);
    }

    public function purchaseVendors(Request $request)
    {
        $data = Vendor::with(['masterBusinesPartnerss' => function ($query) use ($request) {
            if ($request->search) {
                $query->where('name_one', 'ilike', '%' . $request->search . '%');
            }
        }])->where('winner', true);

        if ($request->search) {
            $data = $data->orWhere('vendor', 'ilike', '%' . $request->search . '%');
        }
        
        $data = $data->limit(50)->get();

        $data = $data->map(function ($vendor) {
            return [
                'value' => $vendor->vendor,
                'label' => $vendor->masterBusinesPartnerss->name_one ?? '',
            ];
        })->unique('vendor')
            ->values();

        return $this->successResponse($data);
    }

    public function businessTripAttendance()
    {
        return Inertia::render('Report/BusinessTripAttendance/index');
    }

    public function listBTAttendance(Request $request)
    {
        $query =  BusinessTripDetailAttedance::query()->with(['BusinessTrip']);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');
        $perPage = $request->get('per_page', 10);
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');

        $query->orderBy($sortBy, $sortDirection);

        if (Auth::user()->is_admin != '1') {

            $query->whereHas('BusinessTrip', function ($q) {
                $q->where('created_by', Auth::user()->id)
                    ->orWhere('request_for', Auth::user()->id);
            });
        }

        if ($startDate && $endDate) {
            $query->whereDate('start_date', '>=', $startDate)
                ->whereDate('end_date', '<=', $endDate);
        }

        if ($type) {
            $query->whereHas('BusinessTrip', function ($q) use ($type) {
                $q->whereHas('purposeType', function ($q) use ($type) {
                    $q->where('id', $type);
                });
            });
        }

        if ($destination) {
            $query->whereHas('BusinessTrip', function ($q) use ($destination) {
                $q->whereHas('businessTripDestination', function ($q) use ($destination) {
                    $q->where('destination', $destination);
                });
            });
        }

        if ($department) {
            $query->whereHas('BusinessTrip', function ($q) use ($department) {
                $q->whereHas('requestFor', function ($q) use ($department) {
                    $q->where('departement_id', $department);
                });
            });
        }

        $data =
            $query->whereHas('BusinessTrip', function ($query) {
                $query->where('type', 'declaration')
                    ->whereHas('status', function ($query) {
                        $query->where('name',  'Fully Approve');
                    });
            })
            ->paginate($perPage);

        $data->getCollection()->transform(function ($value) {

            return
                [
                    'id' =>  $value->id,
                    'employee_no' => $value->BusinessTrip->requestFor->nip,
                    'employee_name' => $value->BusinessTrip->requestFor->name,

                    'in' => date('d/m/Y', strtotime($value->start_date)) . ' - ' . date('h:i', strtotime($value->start_time)),

                    'out' => date('d/m/Y', strtotime($value->end_date)) . ' - ' . date('h:i', strtotime($value->end_time)),

                ];
        });


        return $this->successResponse($data);
    }

    public function exportBTAttendance(Request $request)
    {
        $query =  BusinessTripDetailAttedance::query()->with(['BusinessTrip']);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $type = $request->get('type');
        $destination = $request->get('destination');
        $department = $request->get('department');

        $query->orderBy($sortBy, $sortDirection);

        if (Auth::user()->is_admin != '1') {
            $query = $query->where('created_by', Auth::user()->id)
                ->orWhere('request_for', Auth::user()->id);
        }

        if ($startDate && $endDate) {
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
        }

        if ($type) {
            $query->whereHas('purposeType', function ($q) use ($type) {
                $q->where('id', $type);
            });
        }

        if ($destination) {
            $query->whereHas('businessTripDestination', function ($q) use ($destination) {
                $q->where('destination', $destination);
            });
        }

        if ($department) {
            $query->whereHas('requestFor', function ($q) use ($department) {
                $q->where('departement_id', $department);
            });
        }

        $data = $query
            ->whereHas('BusinessTrip', function ($query) {
                $query->whereHas('status', function ($query) {
                    $query->where('name',  'Fully Approve');
                });
            })
            ->get();

        $transformedData = $data->transform(function ($value) {

            return [
                [
                    'employee_no' => $value->BusinessTrip->requestFor->nip,
                    'employee_name' => $value->BusinessTrip->requestFor->name,

                    'date' => date('d/m/Y', strtotime($value->start_date)),
                    'time' => date('h:i', strtotime($value->start_time)),

                    'status' => 1,
                ],
                [
                    'employee_no' => $value->BusinessTrip->requestFor->nip,
                    'employee_name' => $value->BusinessTrip->requestFor->name,

                    'date' => date('d/m/Y', strtotime($value->end_date)),
                    'time' => date('h:i', strtotime($value->end_time)),

                    'status' => 0,
                ]
            ];
        });

        // Return the exported file
        $filename = 'BusinessTrips.xlsx';
        return Excel::download(new BusinessTripAttendanceExport($transformedData), $filename);
    }

    public function listBTAttendanceSunfish(Request $request) // get all data with filter
    {
        $query =  BusinessTripDetailAttedance::query()
            ->with(['BusinessTrip'])
            ->orderBy('date', 'asc');

        $data = $query->whereHas('BusinessTrip', function ($query) {
            $query->where('type', 'declaration')
                ->whereHas('status', function ($query) {
                    $query->where('name',  'Fully Approve');
                });
        })->get();


        $data->transform(function ($value) {

            return [
                [
                    'employee_no' => $value->BusinessTrip->requestFor->nip,
                    'employee_name' => $value->BusinessTrip->requestFor->name,

                    'date' => date('d/m/Y', strtotime($value->start_date)),
                    'time' => date('h:i', strtotime($value->start_time)),

                    'status' => 1,
                ],
                [
                    'employee_no' => $value->BusinessTrip->requestFor->nip,
                    'employee_name' => $value->BusinessTrip->requestFor->name,

                    'date' => date('d/m/Y', strtotime($value->end_date)),
                    'time' => date('h:i', strtotime($value->end_time)),

                    'status' => 0,
                ]
            ];
        });

        return $this->successResponse($data);
    }

    public function listBTAttendanceSunfishMothly(Request $request) // get all data with filter
    {
        $query =  BusinessTripDetailAttedance::query()
            ->with(['BusinessTrip'])
            ->orderBy('date', 'asc');

        $month = $request->get('month');
        $year = $request->get('year');

        if ($month || $year) {
            $year = $year ? $year : date("Y");
            $query->whereMonth('start_date', $month)
                ->whereYear('start_date', $year);
        }
        $data = $query->whereHas('BusinessTrip', function ($query) {
            $query->where('type', 'declaration')
                ->whereHas('status', function ($query) {
                    $query->where('name',  'Fully Approve');
                });
        })->get();


        $data->transform(function ($value) {

            return [
                [
                    'employee_no' => $value->BusinessTrip->requestFor->nip,
                    'employee_name' => $value->BusinessTrip->requestFor->name,

                    'date' => date('d/m/Y', strtotime($value->start_date)),
                    'time' => date('h:i', strtotime($value->start_time)),

                    'status' => 1,
                ],
                [
                    'employee_no' => $value->BusinessTrip->requestFor->nip,
                    'employee_name' => $value->BusinessTrip->requestFor->name,

                    'date' => date('d/m/Y', strtotime($value->end_date)),
                    'time' => date('h:i', strtotime($value->end_time)),

                    'status' => 0,
                ]
            ];
        });

        return $this->successResponse($data);
    }
}
