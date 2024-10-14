<?php

namespace Modules\Reimbuse\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Reimbuse\Models\Reimburse;
use Modules\Reimbuse\Models\ReimburseGroup;
use Modules\Reimbuse\Models\ReimbursePeriod;
use Modules\Reimbuse\Models\ReimburseType;
use Modules\Reimbuse\Models\ReimburseUsed;
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

    public function limit_plafon() {}

    public function index()
    {
        $reimburses = ReimburseGroup::with('reimburses', 'users')->get();

        foreach ($reimburses as $reimburse) {
            $reimburse['status'] = $this->reimbursementService->checkGroupStatus($reimburse->code);
        }

        $users = User::with('families')->select('nip', 'name')->get();
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
