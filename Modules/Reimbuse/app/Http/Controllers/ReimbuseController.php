<?php

namespace Modules\Reimbuse\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Modules\Reimbuse\Models\Reimburse;

class ReimbuseController extends Controller
{
    protected $validator_rule = [
        'type'                  =>  'required|string|exists:reimburse_types,id',
        'requester'             =>  'required|string|exists:users,nip',
        'remark'                =>  'nullable',
        'balance'               =>  'required|numeric',
        'claim_limit'           =>  'required|numeric',
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
        return Inertia::render('Reimburse/ListReimburse');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Reimburse/ReimburseForm');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validator_rule);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        try {
            $data = $validator->validated();
            DB::beginTransaction();
            Reimburse::create($data);
            DB::commit();
            return redirect()->route('order.detail', ['code' => $data['order']])->with('success', 'Order created successfully!');
          } catch (\ErrorException $e) {
            DB::rollBack();
            return back()->withErrors(['status' => $e->getMessage()]);
          }
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
