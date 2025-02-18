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

class ReimbuseController extends Controller
{
    protected $reimbursementService;

    public function __construct(ReimbursementService $reimbursementService)
    {
        $this->reimbursementService = $reimbursementService;
    }

    public function getListMasterReimburseTypeAPI(Request $request)
    {
        $nip = $request->user;
        $hasValue = $request->hasValue;
        
        $getFamilieStatus   = User::select('f.status')->join('families as f', 'f.userId', '=', 'users.id')->where('users.nip', $nip)->groupBy('f.status')->pluck('f.status')->toArray();
        $userId             = User::where('nip', $nip)->first()->id;
        
        $data = MasterTypeReimburse::selectRaw(
            "MAX(CASE WHEN master_type_reimburses.is_employee IS TRUE THEN 1 ELSE 0 END) AS is_employee,
            master_type_reimburses.name || ' (' || code || ')' || ' - for ' || 
            MAX(CASE 
                WHEN master_type_reimburses.is_employee IS TRUE THEN 'employee' 
                ELSE 'family ' 
            END) || 
            MAX(COALESCE(master_type_reimburses.family_status, '')) as label
            , master_type_reimburses.code as value")
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
                ->on('u.id', '=', 'mtrua_grade_relation_not_exist.user_id');
            })
            ->leftJoinSub("
                SELECT
                    MAX(mtr.interval_claim_period) AS max_interval_claim_period,
                    MAX(
                        CASE 
                            WHEN CURRENT_DATE >= r.claim_date 
                                AND CURRENT_DATE <= r.claim_date + (mtr.interval_claim_period || ' days')::interval 
                            THEN 1
                            ELSE 0
                        END
                    ) AS on_interval,
                    mtr.code AS codes
                FROM
                    master_type_reimburses AS mtr
                JOIN reimburses AS r ON
                    r.reimburse_type = mtr.code
                JOIN reimburse_groups  AS rg ON
                    rg.code = r.group
                WHERE
                    r.requester = '". $nip ."'
                    AND rg.status_id in (1,3,5)
                GROUP BY
                    mtr.code
            ",
            'checkInterval',
            function ($join) {
                $join->on('checkInterval.codes', '=', 'master_type_reimburses.code');
            })
            ->where('u.nip', $nip)
            ->whereNull('master_type_reimburses.family_status')
            // ->where(function($query) {
            //     $query->where('checkInterval.on_interval', 0)->orWhereNull('checkInterval.on_interval');
            // })
            ;
        
        if (count($getFamilieStatus) == 0) {
            $data = 
                $data->orWhere(function($query) use ($getFamilieStatus) {
                    $query->where('master_type_reimburses.grade_option', 'all')
                    // ->where(function($query) {
                    //     $query->where('checkInterval.on_interval', 0)->orWhereNull('checkInterval.on_interval');
                    // })
                    ->where(function($query) {
                        $query->whereNotNull('mtrua_grade_relation_exist.user_id')->orWhereNotNull('mtrua_grade_relation_not_exist');
                    })
                    ->where('master_type_reimburses.is_employee', true);
                });
        } else {
            $data = 
                $data->orWhere(function($query) use ($nip, $getFamilieStatus) {
                    $query->where('u.nip', $nip)
                    // ->where(function($query) {
                    //     $query->where('checkInterval.on_interval', 0)->orWhereNull('checkInterval.on_interval');
                    // })
                    ->where(function($query) {
                        $query->whereNotNull('mtrua_grade_relation_exist.user_id')->orWhereNotNull('mtrua_grade_relation_not_exist');
                    })
                    ->whereIn('master_type_reimburses.family_status', $getFamilieStatus);
                })->orWhere(function($query) use ($getFamilieStatus) {
                    $query->where('master_type_reimburses.grade_option', 'all')
                    // ->where(function($query) {
                    //     $query->where('checkInterval.on_interval', 0)->orWhereNull('checkInterval.on_interval');
                    // })
                    ->where(function($query) {
                        $query->whereNotNull('mtrua_grade_relation_exist.user_id')->orWhereNotNull('mtrua_grade_relation_not_exist');
                    })
                    ->where(function($query) use ($getFamilieStatus) {
                        $query->whereIn('master_type_reimburses.family_status', $getFamilieStatus)
                        ->orWhere('master_type_reimburses.is_employee', true);
                    });
                });
        }
        if ($hasValue !== null) $data = $data->orWhere('master_type_reimburses.code', $hasValue);
        if ($request->search) $data = $data->where('master_type_reimburses.name', 'ilike', '%' . $request->search . '%')
                                    ->orWhere('master_type_reimburses.code', 'ilike', '%' . $request->search . '%')
                                    ->orWhere('master_type_reimburses.family_status', 'ilike', '%' . $request->search . '%');
        
        $data = $data->limit(50)->groupBy('master_type_reimburses.name', 'master_type_reimburses.code')->get();
    
        return $this->successResponse($data);
    }

    public function list(Request $request)
    {
        try {
            $query =  ReimburseGroup::query()->with(['user.families', 'reimburses', 'status', 'userCreateRequest', 'purchaseRequisition']);
            if ($request->approval == 1) {
                $approval = Approval::leftJoinSub("
                    SELECT
                        MIN(user_id) as user_id,
                        document_id
                    FROM
                        approvals
                    WHERE
                        document_name = 'REIM'
                        AND status = 'Waiting'
                    GROUP BY document_id
                ",
                'approvalQueueUser',
                function ($join) {
                    $join->on('approvalQueueUser.document_id', '=', 'approvals.document_id');
                })
                ->where([
                    'approvals.document_name' => 'REIM', 
                    'approvals.status' => 'Waiting', 
                    'approvals.user_id' => Auth::user()->id,
                ])
                ->whereColumn('approvalQueueUser.user_id', 'approvals.user_id')
                ->pluck('approvals.document_id')->toArray();
                $query = $query->whereIn('id', $approval)->where('status_id', 1);
            } else {
                $query = $query->where(function ($query) {
                    $query->where('requester', Auth::user()->nip)->orWhere('request_created_by', Auth::user()->id);
                });
            }

            if ($request->search) {
                $query = $query->where(function ($query) use ($request) {
                    $query->where('code', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('remark', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('requester', 'ILIKE', '%' . $request->search . '%');
                });
            }

            $perPage = $request->get('per_page', 10);
            $sortBy = $request->get('sort_by', 'id');
            $sortDirection = $request->get('sort_direction', 'desc');
            $query->orderBy($sortBy, $sortDirection);
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
                    'request_by' => $map->user_create_request->name,
                    'remark' => $map->remark,
                    'balance' => $balance,
                    'form' => count($map->reimburses),
                    'status_id' => $map->status_id,
                    'status' => [
                        'name' => $map->status->name,
                        'classname' => $map->status->classname,
                        'code' =>
                        $map->status->code
                    ],
                    'created_at' => $map->created_at,
                    'pr_number' => isset($map->purchase_requisition[0]) ? $map->purchase_requisition[0]->purchase_requisition_number : '',
                    'pr_status' => isset($map->purchase_requisition[0]) ? $map->purchase_requisition[0]->status : '',
                    'po_number' => isset($map->purchase_requisition[0]) ? $map->purchase_requisition[0]->no_po : '',
                    'po_status' => isset($map->purchase_requisition[0]) ? $map->purchase_requisition[0]->is_closed : '',

                ];
            });
            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function index()
    {
        try {
            $is_Admin = Auth::user()->is_admin;

            $listFamily = [];
            if (!$is_Admin) {
                $users = User::where('id', Auth::id())->select('nip', 'name')->get();

                // $listFamily = Family::where('userId', Auth::user()->id)->get();
            } else {
                $users = User::select('nip', 'name')->get();
                // $listFamily = Family::where('userId', User::select('nip')->pluck('nip')->toArray())->get();
            }

            $currentUser = Auth::user();

            $categories = ['Employee', 'Family'];
            $purchasing_groups = PurchasingGroup::select('id', 'purchasing_group', 'purchasing_group_desc')->get();
            $currencies = Currency::select('code', 'name')->where('code', 'IDR')->get();
            $cost_center = MasterCostCenter::select('id', 'cost_center')->get();
            $taxDefaultValue = (string) Pajak::where('mwszkz', 'V0')->first()->id;
            $uomDefaultValue = (string) Uom::where('iso_code', 'PCE')->first()->id;
            return Inertia::render(
                'Reimburse/Index',
                compact('currentUser',  'users', 'categories', 'currencies', 'taxDefaultValue', 'uomDefaultValue')
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function create()
    {
        return Inertia::render('Reimburse/ReimbursementForm');
    }


    public function store(Request $request)
    {
        $data = $request->all();
        
        try {
            $groupData = [
                'remark' => $data['remark_group'],
                'requester'    => $data['requester'],
                'cost_center'    => $data['cost_center'],
            ];
            $forms = $data['forms'];

            $response = $this->reimbursementService->storeReimbursements($groupData, $forms, $data);
            if (isset($response['error'])) {
                return $this->errorResponse($response['error']);
            }

            return $this->successResponse("All data has been processed successfully");
        } catch (\Exception  $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function edit($id)
    {
        try {
            $groups = ReimburseGroup::where('id', $id)->with('reimburses', 'users')->get();
            return $this->successResponse($groups);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        $groupData = [
            'groupId'       => $id,
            'remark'        => $data['remark_group'],
            'requester'     => $data['requester'],
            'cost_center'   => $data['cost_center'],
        ];
        $forms = $data['forms'];
        $response = $this->reimbursementService->updateReimbursements($groupData, $forms);

        if (isset($response['error'])) return $this->errorResponse($response['error']);
        return $this->successResponse("Reimbursements updated successfully.");
    }


    public function getFamilyDataAPI($user_id, Request $request)
    {
        $listFamily =  Family::where('userId', $user_id)->get();

        return $this->successResponse($listFamily);
    }

    public function getDataLimitAndBalance(Request $request)
    {
        try {
            $user = $request->user;
            $reimbuseTypeID = $request->reimbuse_type;

            $getCurrentBalance = Reimburse::join('reimburse_groups as rb', 'rb.code', '=', 'reimburses.group' )
                ->whereIn('rb.status_id', [1, 3, 5])
                ->where('reimburses.requester', $user)
                ->where('reimburses.reimburse_type', $reimbuseTypeID)
                ->sum('balance');
            
            $getCurrentLimit = Reimburse::join('reimburse_groups as rb', 'rb.code', '=', 'reimburses.group' )
                ->whereIn('rb.status_id', [1, 3, 5])
                ->where('reimburses.requester', $user)
                ->where('reimburses.reimburse_type', $reimbuseTypeID)
                ->count();
            
            $getLastReimburse = Reimburse::join('reimburse_groups as rb', 'rb.code', '=', 'reimburses.group' )
                            ->whereIn('rb.status_id', [1, 3, 5])
                            ->where('reimburses.requester', $user)
                            ->where('reimburses.reimburse_type', $reimbuseTypeID)
                            ->orderBy('reimburses.id', 'desc')
                            ->first();

            $reimbuseType   = MasterTypeReimburse::where('code', $reimbuseTypeID)->first();
            $user           = User::where('nip', $user)->first();
            if (!empty($getLastReimburse) && $reimbuseType->interval_claim_period !== null) {
                $createDate         = Carbon::createFromFormat('Y-m-d', $getLastReimburse->claim_date);
                $availableClaimDate = $createDate->addDays((int)$reimbuseType->interval_claim_period);
                if (Carbon::now()->format('Y-m-d') > $availableClaimDate) {
                    $getCurrentBalance = 0;    
                    $getCurrentLimit = 0;
                }
            }

            if ($reimbuseType->grade_option == 'grade') {
                $userGrade = BusinessTripGradeUser::where('user_id', $user->id)->first();
                $reimbuseGrade = MasterTypeReimburseGrades::where('grade_id', $userGrade->grade_id)->where('reimburse_type_id', $reimbuseType->id)->first();

                $balance =  (float)($reimbuseGrade->plafon) - (float) $getCurrentBalance;
            } else {
                $balance = (float) $reimbuseType->grade_all_price - (float) $getCurrentBalance;
            }
            $limit = (float) $reimbuseType->limit - (float) $getCurrentLimit;
            $context = [
                'current_balance' => (float) $getCurrentBalance,
                'balance' => (float) $balance,
                'limit' => $limit,
                'current_limit' => $getCurrentLimit,
                'type_limit' => $reimbuseType->limit == null ? 'Unlimited' : $reimbuseType->limit,
                'type_balance' => $reimbuseType->grade_all_price
            ];



            return $this->successResponse($context);
        } catch (\Throwable $th) {
            //throw $th;
            return $this->errorResponse($th->getMessage());
        }
    }

    public function detailAPI($id, Request $request)
    {

        $reimburseGroup = ReimburseGroup::where('id', $id)
            ->with(['user.families', 'costCenter', 'status', 'userCreateRequest'])
            ->first();

        if ($reimburseGroup) {
            $reimburseGroup->reimbursementStatus = $reimburseGroup->status;
            unset($reimburseGroup->status);
        }

        $gradeId = User::select('btg.id as grade_id')
        ->join('business_trip_grade_users as btgu', 'btgu.user_id', '=', 'users.id')
        ->join('business_trip_grades as btg', 'btg.id', '=', 'btgu.grade_id')
        ->where('nip', $reimburseGroup->requester)
        ->first()->grade_id ?? null;
        
        $reimburseForms = Reimburse::where('group', $reimburseGroup->code)->with([
            'uomModel',
            'purchasingGroupModel',
            'taxOnSalesModel',
            'reimburseType.gradeReimburseTypes' => function ($query) use ($gradeId) {
                $query->where('grade_id', $gradeId);
            },
            'reimburseAttachment'
        ])->get();

        $approval = Approval::with('user.positions')->where('document_id', $id)->where('document_name', 'REIM')->orderBy('id', 'ASC')->get();

        return $this->successResponse([
            'group' => $reimburseGroup,
            'forms' => $reimburseForms,
            'approval' => $approval,
        ]);
    }

    function print($id)
    {
        $reimburseGroup = ReimburseGroup::where('id', $id)
            ->with(['user', 'costCenter', 'status'])
            ->first();

        if ($reimburseGroup) {
            $reimburseGroup->reimbursementStatus = $reimburseGroup->status;
            unset($reimburseGroup->status);
        }

        $gradeId = User::select('btg.id as grade_id')
        ->join('business_trip_grade_users as btgu', 'btgu.user_id', '=', 'users.id')
        ->join('business_trip_grades as btg', 'btg.id', '=', 'btgu.grade_id')
        ->where('nip', $reimburseGroup->requester)
        ->first()->grade_id ?? null;
        
        $reimburseForms = Reimburse::where('group', $reimburseGroup->code)->with([
            'uomModel',
            'purchasingGroupModel',
            'taxOnSalesModel',
            'reimburseType.gradeReimburseTypes' => function ($query) use ($gradeId) {
                $query->where('grade_id', $gradeId);
            },
            'reimburseAttachment'
        ])->get();

        $approval = Approval::with('user.divisions')->where('document_id', $id)->where('document_name', 'REIM')->orderBy('id', 'ASC')->get();

        $data = [
            'group'     => $reimburseGroup,
            'forms'     => $reimburseForms,
            'approval'  => $approval
        ];

        return view('print-reimburse', compact('data'));
    }

    public function dropdownFamily(Request $request)
    {
        $userId             = $request->user;
        $reimburseType      = $request->reimburseType;
        $getFamilyStatus    = MasterTypeReimburse::where('code', $reimburseType)->first()->family_status ?? '';
        
        $data = User::select('f.name as label', 'f.id as value')
            ->join('families as f', 'f.userId', '=', 'users.id')
            ->where([
                'users.nip' => $userId, 
                'f.status' => $getFamilyStatus,
            ]);

        if ($request->search) {
            $data = $data->Where('f.name', 'ilike', '%' . $request->search . '%');
        }

        $data = $data->limit(50)->groupBy('f.name', 'f.id')->get();
        return $this->successResponse($data);
    }

    function dropdownEmployee(Request $request)
    {
        $data = User::selectRaw("name || ' [' || nip || ']' as label, nip as value");
        if (Auth::user()->is_admin == 0) $data = $data->where('id', Auth::user()->id);
        if ($request->search) {
            $data = $data->where('name', 'ilike', '%' . $request->search . '%')->orWhere('nip', 'ilike', '%' . $request->search . '%');
        }

        $data = $data->limit(50)->get();
        return $this->successResponse($data);
    }

    public function cloneValidation($id) {
        $data =  ReimburseGroup::with(['reimburses.reimburseType'])->where('id', $id)->first();
        foreach ($data->reimburses as $key => $value) {
            $dateNow = Carbon::now()->format('Y-m-d');
            if ($value->reimburseType->interval_claim_period != null && ($dateNow >= $value->claim_date && $dateNow <= Carbon::createFromFormat('Y-m-d', $value->claim_date)->addDays($value->reimburseType->interval_claim_period))) {
                return $this->errorResponse('Failed, unable to clone this data as the data type reimbursement used falls within the claim period.');
            };
        }

        return true;
    }
}