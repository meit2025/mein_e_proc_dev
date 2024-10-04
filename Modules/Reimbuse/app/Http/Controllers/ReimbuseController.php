<?php

namespace Modules\Reimbuse\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Reimbuse\Models\ReimburseGroup;
use Modules\Reimbuse\Models\ReimbursePeriod;
use Modules\Reimbuse\Models\ReimburseType;
use Modules\Reimbuse\Services\ReimbursementService;

class ReimbuseController extends Controller
{
    protected $reimbursementService;

    public function __construct(ReimbursementService $reimbursementService)
    {
        $this->reimbursementService = $reimbursementService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reimburses = ReimburseGroup::with('reimburses', 'users')->get();
        foreach($reimburses as $reimburse){
            $reimburse['status'] = $this->reimbursementService->checkGroupStatus($reimburse->code);
        }
        $users = User::select('nip', 'name')->get();
        $types = ReimburseType::select('code', 'name', 'claim_limit', 'plafon')->get();
        $currencies = Currency::select('code', 'name')->get();
        $periods = ReimbursePeriod::select('id', 'code', 'start', 'end')->get();

        $csrf_token = csrf_token();
        return Inertia::render('Reimburse/ListReimburse', [
            'groups'        =>  $reimburses,
            'progress'      =>  '',
            'users'         =>  $users,
            'types'         =>  $types,
            'currencies'    =>  $currencies,
            'periods'       =>  $periods,
            'csrf_token'    =>  $csrf_token
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Reimburse/ReimbursementForm');
    }

    /**
     * Store a newly created resource in storage.
     */

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


    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('reimbuse::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('reimbuse::edit');
    }

    /**
     * Update the specified resource in storage.
     */
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


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
