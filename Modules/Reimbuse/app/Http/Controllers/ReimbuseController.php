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

        $getFamilieStatus = User::select('f.status')->join('families as f', 'f.userId', '=', 'users.id')->where('users.nip', $nip)->groupBy('f.status')->pluck('f.status')->toArray();
        
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
            ->leftJoin('business_trip_grade_users as btgu', 'btgu.grade_id', '=', 'mtrg.grade_id')
            ->leftJoin('users as u', 'u.id', '=', 'btgu.user_id')
            ->leftJoinSub("
                select
                    max(mtr.interval_claim_period),
                    max(r.claim_date + (mtr.interval_claim_period || ' days')::INTERVAL) as on_interval,
                    mtr.code as codes
                FROM
                    master_type_reimburses AS mtr
                JOIN
                    reimburses AS r ON r.reimburse_type = mtr.code
                where r.requester = '". $nip ."' 
                and (r.claim_date BETWEEN r.claim_date and r.claim_date + (mtr.interval_claim_period || ' days')::INTERVAL
                or mtr.interval_claim_period is null)
                group by mtr.code
            ",
            'checkInterval',
            function ($join) {
                $join->on('checkInterval.codes', '=', 'master_type_reimburses.code');
            })
            ->where(['u.nip' => $nip]);
        
        if (count($getFamilieStatus) == 0) {
            $data = $data->where('master_type_reimburses.is_employee', true)
            ->orWhere(function($query)  {
                $query->where('master_type_reimburses.grade_option', 'all')
                ->where('master_type_reimburses.is_employee', true);
            });
            if ($hasValue !== null) $data = $data->orWhere('checkInterval.codes', $hasValue);
        } else {
            $data = $data->where('master_type_reimburses.family_status', null)
            ->orWhereIn('master_type_reimburses.family_status', $getFamilieStatus)
            ->where('checkInterval.codes', null);
            if ($hasValue !== null) $data = $data->orWhere('checkInterval.codes', $hasValue);
            $data = $data->orWhere('master_type_reimburses.grade_option', 'all');
        }
        if ($request->search) $data = $data->where('master_type_reimburses.name', 'ilike', '%' . $request->search . '%')
                                    ->orWhere('master_type_reimburses.code', 'ilike', '%' . $request->search . '%')
                                    ->orWhere('master_type_reimburses.family_status', 'ilike', '%' . $request->search . '%');
        
        $data = $data->limit(50)->groupBy('master_type_reimburses.name', 'master_type_reimburses.code')->get();
        
        return $this->successResponse($data);
    }

    public function list(Request $request)
    {
        try {
            $query =  ReimburseGroup::query()->with(['user.families', 'reimburses', 'status', 'userCreateRequest']);
            if ($request->approval == 1) {
                $approval = Approval::where('user_id', Auth::user()->id)
                    ->where(['document_name' => 'REIM', 'status' => 'Waiting'])->pluck('document_id')->toArray();
                $query = $query->whereIn('id', $approval);
            } else {
                if (Auth::user()->is_admin == '0') $data = $query->where('requester', Auth::user()->nip);
            }

            if ($request->search) {
                $query = $query->orWhere('code', 'ILIKE', '%' . $request->search . '%')
                ->orWhere('remark', 'ILIKE', '%' . $request->search . '%')
                ->orWhere('requester', 'ILIKE', '%' . $request->search . '%');

                $query = $query->orWhereHas('reimburses', function ($q) use ($request) {
                    $q->where('remark', 'ILIKE', '%' . $request->search . '%');
                });

                $query = $query->orWhereHas('status', function ($q) use ($request) {
                    $q->where('name', 'ILIKE', '%' . $request->search . '%');
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
                    'createdDate' => $map->created_at,

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
                ->whereIn('rb.status_id', [1,5])
                ->where('reimburses.requester', $user)
                ->where('reimburses.reimburse_type', $reimbuseTypeID)
                ->sum('balance');
            
            $getCurrentLimit = Reimburse::join('reimburse_groups as rb', 'rb.code', '=', 'reimburses.group' )
                ->whereIn('rb.status_id', [1,5])
                ->where('reimburses.requester', $user)
                ->where('reimburses.reimburse_type', $reimbuseTypeID)
                ->count();

            $reimbuseType   = MasterTypeReimburse::where('code', $reimbuseTypeID)->first();
            $user           = User::where('nip', $user)->first();
            $balance        = (float) $reimbuseType->grade_all_price - (float) $getCurrentBalance;

            if ($reimbuseType->grade_option == 'grade') {
                $userGrade = BusinessTripGradeUser::where('user_id', $user->id)->first();
                $reimbuseGrade = MasterTypeReimburseGrades::where('grade_id', $userGrade->grade_id)->where('reimburse_type_id', $reimbuseType->id)->first();

                $balance =  (float)($reimbuseGrade->plafon) - (float) $getCurrentBalance;
            }
            $limit = (float) $reimbuseType->limit - (float) $getCurrentLimit;
            $context = [
                'current_balance' => (float) $getCurrentBalance,
                'balance' => (float) $balance,
                'limit' => $limit,
                'current_limit' => $getCurrentLimit,
                'type_limit' => $reimbuseType->limit,
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

        $reimburseForms = Reimburse::where('group', $reimburseGroup->code)->with([
            'uomModel',
            'purchasingGroupModel',
            'taxOnSalesModel',
            'reimburseType',
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
        
        $reimburseForms = Reimburse::where('group', $reimburseGroup->code)->with([
            'uomModel',
            'purchasingGroupModel',
            'taxOnSalesModel',
            'reimburseType',
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