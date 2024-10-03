<?php

namespace Modules\Reimbuse\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Modules\Reimbuse\Jobs\ProcessReimbursements;
use Modules\Reimbuse\Models\Reimburse;
use Modules\Reimbuse\Models\ReimbursePeriod;
use Modules\Reimbuse\Models\ReimburseType;

class ReimbuseController extends Controller
{
    protected $validator_rule = [
        'type'                  =>  'required|string|exists:reimburse_types,code',
        'requester'             =>  'required|string|exists:users,nip',
        'group'                 =>  'nullable',
        'remark'                =>  'nullable',
        'balance'               =>  'required|numeric',
        'receipt_date'          =>  'required|date',
        'start_date'            =>  'required|date',
        'end_date'              =>  'required|date',
        'start_balance_date'    =>  'required|date',
        'end_balance_date'      =>  'required|date',
        'currency'              =>  'required|string|exists:currencies,code'
    ];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reimburses = Reimburse::with('users')->get();
        $users = User::select('nip', 'name')->get();
        $types = ReimburseType::select('code', 'name')->get();
        $currencies = Currency::select('code', 'name')->get();
        $periods = ReimbursePeriod::select('id', 'start', 'end')->get();
        
        $csrf_token = csrf_token();
        return Inertia::render('Reimburse/ListReimburse', [
            'reimburses'    =>  $reimburses,
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
        $reimbursements = $request->all();
        // if (!is_array($reimbursements)) {
        //     return back()->withErrors(['status' => 'Invalid input format. Expecting an array of reimbursements.']);
        // }
        // foreach ($reimbursements as $reimbursementData) {
        $validator = Validator::make($reimbursements, $this->validator_rule);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        try {
            $data = $validator->validated();
            DB::beginTransaction();
            Reimburse::create($data);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['status' => $e->getMessage()]);
        }
        // }
        return "All data has been processed successfully.";
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
