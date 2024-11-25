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


    public function getTypeCode()
    {
        $reimbuseQuotaUser =  MasterQuotaReimburseUser::where('user_id', Auth::user()->id)->pluck('quota_reimburses_id')->toArray();

        // dd(Auth::user()->id);

        // get latest period for new period
        $latestPeriode = MasterPeriodReimburse::orderBy('id', 'desc')->first();


        // get data when reimburse quota user and latest periode showing
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

    public function getListMasterReimburseTypeAPI($type, Request $request)
    {

        $res = ($type == 'Employee') ? 1 : 0;
        $data = MasterTypeReimburse::query()
            ->where('is_employee', $res)
            ->whereIn('id', $this->getTypeCode());



        // $data = $data->where('material_number', 'like', '%' . 'm' . '%');
        if ($request->filter && ($request->search && $request->search != '')) {
            foreach ($request->filter as $f) {
                $data = $data->where($f, 'ilike', '%' . $request->search . '%');
            }

            return $this->successResponse($data->get());
        }





        $data =  $data->limit(100)->get();


        return $this->successResponse($data);




        // try {
        //     $res = ($type == 'Employee') ? 1 : 0;
        //     $typeData = MasterTypeReimburse::query()

        //     where('is_employee', $res)
        //         ->whereIn('id', $this->getTypeCode())

        //         ->get();
        //     return $this->successResponse($typeData);
        // } catch (\Exception $e) {
        //     return $this->errorResponse($e->getMessage(), 400);
        // }
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
            $perPage = $request->get('per_page', 10);
            $sortBy = $request->get('sort_by', 'id');
            $sortDirection = $request->get('sort_direction', 'asc');
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
                    // 'status' => $this->reimbursementService->checkGroupStatus($map->code),
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
            $currencies = Currency::select('code', 'name')->get();
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


            $response = $this->reimbursementService->storeReimbursements($groupData, $forms);
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

    public function update(Request $request)
    {
        $data = $request->all();
        $forms = $data['forms'];
        $response = $this->reimbursementService->updateReimbursements($forms);
        if (isset($response['error'])) {
            return back()->withErrors(['status' => $response['error']]);
        }
        return redirect()->back()->with('status', 'Reimbursements updated successfully.');
    }


    public function getFamilyDataAPI($user_id, Request $request)
    {
        $listFamily =  Family::where('userId', $user_id)->get();

        return $this->successResponse($listFamily);
    }

    public function getDataLimitAndBalance(Request $request)
    {

        $user = $request->user;
        $period = $request->periode;
        $reimbuseTypeID = $request->reimbuse_type_id;


        $getCurrentBalance = Reimburse::where('requester', $request->user)
            ->where('period', $period)
            ->where('reimburse_type', $reimbuseTypeID)
            ->sum('balance');

        $getCurrentLimit = Reimburse::where('requester', $request->user)
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
    }

    public function detailAPI($id, Request $request)
    {

        $reimburseGroup = ReimburseGroup::where('id', $id)
            ->with(['user', 'costCenter'])
            ->first();

        $reimburseForms = Reimburse::where('group', $reimburseGroup->code)->with([
            'uomModel',
            'purchasingGroupModel',
            'taxOnSalesModel',
            'reimburseType',
            'periodeDate'
        ])
            ->get();

        return $this->successResponse([
            'group' => $reimburseGroup,
            'forms' => $reimburseForms
        ]);
    }


    public function getPeriodAPI(Request $request)
    {

        $user =  User::where('nip', $request->user)->first();

        $reimbuseMaster = MasterTypeReimburse::where('code', $request->type)->select('id')->first();
        $reimburseQuotaPeriod = MasterQuotaReimburse::where('type', $reimbuseMaster->id)
            ->get()->pluck('period');


        $reimbursePeriod = MasterPeriodReimburse::whereIn('id', $reimburseQuotaPeriod)->get();


        return $this->successResponse($reimbursePeriod);
    }
}
