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
use Modules\Master\Models\MasterPeriodReimburse;
use Modules\Master\Models\MasterQuotaReimburse;
use Modules\Master\Models\MasterQuotaReimburseUser;
use Modules\Master\Models\MasterTypeReimburse;
use Modules\Master\Models\MasterTypeReimburseGrades;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\PurchasingGroup;
use Modules\Reimbuse\Services\ReimbursementService;

class ReimbuseController extends Controller
{
    protected $reimbursementService;

    public function __construct(ReimbursementService $reimbursementService)
    {
        $this->reimbursementService = $reimbursementService;
    }


    public function getTypeCode($userId)
    {
        $reimbuseQuotaUser =  MasterQuotaReimburseUser::where('user_id', $userId)->pluck('quota_reimburses_id')->toArray();

        $latestPeriode = MasterPeriodReimburse::orderBy('id', 'desc')->first();

        $reimburseQuotaTypeCode =  MasterQuotaReimburse::query()->whereIn('id', $reimbuseQuotaUser)
            ->where('period', $latestPeriode->id)
            ->pluck('type');

        return $reimburseQuotaTypeCode;
    }

    public function getTypeData($type)
    {
        try {
            $res = ($type == 'Employee') ? 1 : 0;
            $typeData = MasterTypeReimburse::where('is_employee', $res)
                ->whereIn('id', $this->getTypeCode())
                ->get();
            return $this->successResponse($typeData);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function getListMasterReimburseTypeAPI(Request $request)
    {
        $userId             = $request->user;
        $familyRelationship = $request->familyRelationship == 'Employee' ? 1 : 0;
        $data = MasterQuotaReimburseUser::selectRaw("mtr.name || ' (' || code || ')' as label, mtr.code as value")
            ->join('users as u', 'u.id', '=', 'master_quota_reimburse_users.user_id')
            ->join('master_quota_reimburses as mqr', 'mqr.id', '=', 'master_quota_reimburse_users.quota_reimburses_id')
            ->join('master_type_reimburses as mtr', 'mtr.id', '=', 'mqr.type')
            ->where(['u.nip' => $userId, 'mtr.is_employee' => $familyRelationship]);

        if ($request->search) {
            $data = $data->where('mtr.name', 'ilike', '%' . $request->search . '%');
        }

        $data = $data->limit(50)->groupBy('mtr.name', 'mtr.code')->get();
        return $this->successResponse($data);
    }


    public function checkBalance(Request $request)
    {

        $user = $request->user;
        $type = $request->type;
    }
    public function is_required(Request $request)
    {
        $user = $request->user;
        $is_employee = $request->is_employee;
        $category = $request->category;
        $period = $request->period;
        try {
            if (!$is_employee) {
                $grade = json_decode(Family::with('user')->where('id', $user)->first())->user->grade_reimburse;
            } else {
                $grade = User::select('grade_reimburse')->where('nip', $user)->first()->grade_reimburse;
            }
            $quota = MasterQuotaReimburse::select('period', 'type', 'grade', 'limit', 'plafon')
                ->where('grade', $grade)
                ->where('period', $period)
                ->where('type', $category)
                ->first();
            $used = Reimburse::where('for', $user)
                ->select('group', 'balance', 'updated_at')
                ->where('period', $period)
                ->where('type', $category);
            $progress = $used->get()->unique('group');
            $used_plafon = $used->sum('balance');
            $used_limit = $used->count();
            $last_request = [];
            $progresses = [];
            foreach ($progress as $val) {
                $progresses[] = $this->reimbursementService->checkGroupStatus($val->group);
                $date = ReimburseGroup::select('updated_at')
                    ->where('code', $val->group)
                    ->first()->updated_at;
                $last_request[] = abs(now()->diffInYears(Carbon::parse($date))) >= 1;
            }
            $gap_ok = !in_array(False, $progresses);
            $progress_ok = !in_array('Open', $progresses);
            $used_plafon < ($quota->plafon ?? 0) ? $quota['plafon'] -= $used_plafon : $quota['plafon'] = 0;
            $used_limit < ($quota->limit ?? 0) ? $quota['limit'] -= $used_plafon : $quota['limit'] = 0;
            if ($gap_ok && $progress_ok) {
                return $this->successResponse($quota);
            } else {
                $message = [];
                $gap_ok ? $message[] = null : $message[] = " period has not 1 year or more,";
                $progress_ok ? $message[] = null : $message[] = " previous progress is open,";
                return $this->errorResponse(implode("", $message), 400);
            }
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function list(Request $request)
    {
        try {
            $query =  ReimburseGroup::query()->with(['reimburses', 'status']);
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
                    'request_for' => $map->requester,
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
            $periods = MasterPeriodReimburse::select('id', 'code', 'start', 'end')->get();
            $cost_center = MasterCostCenter::select('id', 'cost_center')->get();
            $taxes = Pajak::select('id', 'mwszkz')->get();

            $latestPeriod = MasterPeriodReimburse::orderBy('id', 'desc')->first();

            return Inertia::render(
                'Reimburse/Index',
                compact('purchasing_groups', 'currentUser', 'latestPeriod',  'users', 'categories', 'currencies', 'periods', 'cost_center', 'taxes')
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
            $period = $request->periode;
            $reimbuseTypeID = $request->reimbuse_type_id;


            $getCurrentBalance = Reimburse::where('requester', $user)
                ->where('period', $period)
                ->where('reimburse_type', $reimbuseTypeID)
                ->sum('balance');

            $getCurrentLimit = Reimburse::where('requester', $user)
                ->where('period', $period)
                ->where('reimburse_type', $reimbuseTypeID)
                ->count();


            $reimbuseType = MasterTypeReimburse::where('code', $reimbuseTypeID)->first();



            $user =  User::where('nip', $user)->first();

            $balance =  (float) $reimbuseType->grade_all_price - (float) $getCurrentBalance;

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
            ->with(['user', 'costCenter', 'status', 'userCreateRequest'])
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
            'periodeDate'
        ])
            ->get();

        $approval = Approval::with('user.divisions')->where('document_id', $id)->where('document_name', 'REIM')->orderBy('id', 'ASC')->get();

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
            'periodeDate'
        ])->get();

        $approval = Approval::with('user.divisions')->where('document_id', $id)->where('document_name', 'REIM')->orderBy('id', 'ASC')->get();

        $data = [
            'group'     => $reimburseGroup,
            'forms'     => $reimburseForms,
            'approval'  => $approval
        ];

        return view('print-reimburse', compact('data'));
    }


    public function getPeriodAPI(Request $request)
    {
        $userId             = $request->user;
        $familyRelationship = $request->familyRelationship == 'Employee' ? 1 : 0;
        $reimburseType      = $request->reimburseType;

        $data = MasterQuotaReimburseUser::selectRaw('mpr.code || \' (\' || mpr.start || \' - \' || mpr.end || \')\' as label, mpr.code as value')
            ->join('users as u', 'u.id', '=', 'master_quota_reimburse_users.user_id')
            ->join('master_quota_reimburses as mqr', 'mqr.id', '=', 'master_quota_reimburse_users.quota_reimburses_id')
            ->join('master_type_reimburses as mtr', 'mtr.id', '=', 'mqr.type')
            ->join('master_period_reimburses as mpr', 'mpr.id', '=', 'mqr.period')
            ->where(['u.nip' => $userId, 'mtr.is_employee' => $familyRelationship, 'mtr.code' => $reimburseType]);

        if ($request->search) {
            $data = $data
                ->where('code', 'ilike', '%' . $request->search . '%')
                ->orWhere('start', 'ilike', '%' . $request->search . '%')
                ->orWhere('end', 'ilike', '%' . $request->search . '%');
        }

        $data = $data->limit(50)->groupBy('mpr.code', 'mpr.start', 'mpr.end')->get();
        return $this->successResponse($data);
    }

    public function dropdownFamily(Request $request)
    {
        $userId             = $request->user;
        $familyRelationship = $request->familyRelationship == 'Employee' ? 1 : 0;
        $reimburseType      = $request->reimburseType;
        $reimbursePeriod    = $request->reimbursePeriod;
        $getFamilyStatus = MasterTypeReimburse::where('code', $reimburseType)->first()->family_status ?? '';

        $data = MasterQuotaReimburseUser::select('f.name as label', 'f.id as value')
            ->join('users as u', 'u.id', '=', 'master_quota_reimburse_users.user_id')
            ->join('families as f', 'f.userId', '=', 'u.id')
            ->join('master_quota_reimburses as mqr', 'mqr.id', '=', 'master_quota_reimburse_users.quota_reimburses_id')
            ->join('master_type_reimburses as mtr', 'mtr.id', '=', 'mqr.type')
            ->join('master_period_reimburses as mpr', 'mpr.id', '=', 'mqr.period')
            ->where(['u.nip' => $userId, 'mtr.is_employee' => $familyRelationship, 'mtr.code' => $reimburseType, 'f.status' => $getFamilyStatus, 'mpr.code' => $reimbursePeriod]);

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
}
