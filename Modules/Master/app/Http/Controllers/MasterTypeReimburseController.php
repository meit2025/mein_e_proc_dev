<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Modules\Master\Models\MasterMaterial;
use Modules\Master\Models\MasterTypeReimburse;

class MasterTypeReimburseController extends Controller
{
    public function list(Request $request)
    {
        try {
            $filterableColumns =  [
                'code',
                'name',
                'is_employee',
                'material_group',
                'material_number'
            ];
            $data = $this->filterAndPaginate($request, MasterTypeReimburse::class, $filterableColumns);
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
            $listMaterial = MasterMaterial::get();
            return Inertia::render(
                'Master/MasterReimburseType/Index',
                compact('listMaterial')
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
            'code' => 'required|unique:master_type_reimburses',
            'name' => 'required',
            'is_employee' => 'required|boolean',
            'material_group' => 'required',
            'material_number' => 'required'
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->errorResponse($validator->errors());
        }
        DB::beginTransaction();
        try {
            $validatedData = $validator->validated();
            MasterTypeReimburse::create($validatedData);
            DB::commit();
            return $this->successResponse("Create Reimburse Type Successfully");
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
