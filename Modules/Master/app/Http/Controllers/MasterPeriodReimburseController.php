<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Modules\Master\Models\MasterPeriodReimburse;

class MasterPeriodReimburseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $filterableColumns =  [
                'code',
                'start',
                'end',
            ];

            $data = $this->filterAndPaginate($request, MasterPeriodReimburse::class, $filterableColumns);
            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('master::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'code' => 'required|unique:master_period_reimburses',
            'start' => 'required|date',
            'end' => 'required|date',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->errorResponse($validator->errors());
        }
        DB::beginTransaction();
        try {
            $validatedData = $validator->validated();
            MasterPeriodReimburse::create($validatedData);
            DB::commit();
            return $this->successResponse("Create Reimburse Period Successfully");
        } catch (\Exception  $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('master::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $groups = MasterPeriodReimburse::where('id', $id)->get();
            return $this->successResponse($groups);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'start' => 'required|date',
            'end' => 'required|date',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->errorResponse($validator->errors());
        }
        DB::beginTransaction();
        try {
            $getData        = MasterPeriodReimburse::find($id);
            $validatedData = $validator->validated();
            $getData->fill($validatedData);
            $getData->save();
            DB::commit();

            return $this->successResponse("Create Reimburse Period Successfully");
        } catch (\Exception  $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            MasterPeriodReimburse::find($id)->delete();
            DB::commit();

            return $this->successResponse([], 'Delete Reimburse Period Successfully');
        } catch (\Exception  $e) {
            DB::rollBack();
            return $this->errorResponse($e);
        }
    }
}
