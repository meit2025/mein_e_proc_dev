<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Modules\BusinessTrip\Models\BusinessTripGrade;
use Modules\Master\Models\MasterPeriodReimburse;
use Modules\Master\Models\MasterQuotaReimburse;
use Modules\Master\Models\MasterTypeReimburse;

class MasterQuotaReimburseController extends Controller
{
    public function list(Request $request)
    {
        try {
            $filterableColumns =  [
                'period',
                'type',
                'grade',
                'limit',
                'plafon'
            ];
            $data = $this->filterAndPaginate($request, MasterQuotaReimburse::class, $filterableColumns);
            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            
            $listPeriodReimburse = MasterPeriodReimburse::get();
            $listTypeReimburse = MasterTypeReimburse::get();
            $listGrade = BusinessTripGrade::get();
            return Inertia::render(
                'Master/MasterReimburseQuota/Index',
                compact('listPeriodReimburse', 'listTypeReimburse', 'listGrade')
            );
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
            'period' => 'required|exists:master_period_reimburses,id',
            'type' => 'required|exists:master_type_reimburses,id',
            'grade' => 'required|exists:business_trip_grades,id',
            'plafon' => 'required',
            'limit' => 'required'
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->errorResponse($validator->errors());
        }
        DB::beginTransaction();
        try {
            $validatedData = $validator->validated();
            MasterQuotaReimburse::create($validatedData);
            DB::commit();
            return $this->successResponse("Create Reimburse Quota Successfully");
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
        return view('master::edit');
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
