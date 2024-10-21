<?php

namespace Modules\Reimbuse\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\Family;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Reimbuse\Models\Reimburse;
use Modules\Reimbuse\Models\ReimburseGroup;
use Modules\Reimbuse\Models\ReimbursePeriod;
use Modules\Reimbuse\Models\ReimburseQuota;
use Modules\Reimbuse\Models\ReimburseType;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Modules\Reimbuse\Services\ReimbursementService;

class ReimbuseController extends Controller
{
    protected $reimbursementService;

    public function __construct(ReimbursementService $reimbursementService)
    {
        $this->reimbursementService = $reimbursementService;
    }

    public function getTypeData($type)
    {
        try {
            $res = ($type == 'Employee') ? 1 : 0;
            $typeData = ReimburseType::where('is_employee', $res)->get();
            return $this->successResponse($typeData);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function is_required(Request $request)
    {
        $user = $request->user;
        $is_employee = $request->is_employee;
        $type = $request->type;
        $period = $request->period;
        try {
            if (!$is_employee) {
                $grade = json_decode(Family::with('user')->where('id', $user)->first())->user->grade_reimburse;
            } else {
                $grade = User::select('grade_reimburse')->where('nip', $user)->first()->grade_reimburse;
            }
            $quota = ReimburseQuota::select('period', 'type', 'grade', 'limit', 'plafon')
                ->where('grade', $grade)
                ->where('period', $period)
                ->where('type', $type)
                ->first();
            $used = Reimburse::where('for', $user)
                ->select('group', 'balance', 'updated_at')
                ->where('period', $period)
                ->where('type', $type);
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
            $plafon_ok = $used_plafon < ($quota->plafon ?? 0);
            $limit_ok = $used_limit < ($quota->limit ?? 0);
            $quota['limit'] -= $used_limit;
            $quota['plafon'] -= $used_plafon;
            if ($gap_ok && $progress_ok && $plafon_ok && $limit_ok) {
                return $this->successResponse($quota);
            } else {
                $message = [];
                $gap_ok ? $message[] = null : $message[] = " period has not 1 year or more,";
                $progress_ok ? $message[] = null : $message[] = " previous progress is open,";
                $plafon_ok ? $message[] = null : $message[] = " Balance is run out,";
                $limit_ok ? $message[] = null : $message[] = " Limit has exceeded.";
                return $this->errorResponse(implode("", $message), 400);
            }
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function index()
    {
        $is_Admin = Auth::user()->role === 'admin';
        $reimburses = ReimburseGroup::with('reimburses', 'users')->get();

        foreach ($reimburses as $reimburse) {
            $reimburse['status'] = $this->reimbursementService->checkGroupStatus($reimburse->code);
        }

        if (!$is_Admin) {
            $users = User::with('families')->where('id', Auth::id())->select('nip', 'name')->get();
        }else{
            $users = User::with('families')->select('nip', 'name')->get();
        }

        $types = ['Employee', 'Family'];
        $currencies = Currency::select('code', 'name')->get();
        $periods = ReimbursePeriod::select('id', 'code', 'start', 'end')->get();
        $csrf_token = csrf_token();

        return Inertia::render('Reimburse/ListReimburse', [
            'groups'        =>  $reimburses,
            'users'         =>  $users,
            'types'         =>  $types,
            'currencies'    =>  $currencies,
            'periods'       =>  $periods,
            'csrf_token'    =>  $csrf_token
        ]);
    }

    public function create()
    {
        return Inertia::render('Reimburse/ReimbursementForm');
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $groupData = [
            'remark' => $data['remark_group'],
            'requester'    => $data['requester'],
        ];
        $forms = $data['forms'];
        $response = $this->reimbursementService->storeReimbursements($groupData, $forms);
        if (isset($response['error'])) {
            return back()->withErrors(['status' => $response['error']]);
        }
        return redirect()->back()->with('status', 'All data has been processed successfully.');
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        $forms = $data['forms'];
        $response = $this->reimbursementService->updateReimbursements($forms);
        if (isset($response['error'])) {
            return back()->withErrors(['status' => $response['error']]);
        }
        return redirect()->back()->with('status', 'Reimbursements updated successfully.');
    }
}
