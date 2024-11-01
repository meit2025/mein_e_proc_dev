<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Modules\BusinessTrip\Models\AllowanceCategory;

class AllowanceCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('BusinessTrip/AllowanceCategory/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('businesstrip::create');
    }

    public function listAPI(Request $request)
    {

        $query =  AllowanceCategory::query();
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');


        $query->orderBy($sortBy, $sortDirection);

        $data = $query->paginate($perPage);


        return $this->successResponse($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeAPI(Request $request)
    {
        $rules = [
            'name' => 'required',
            'code' => 'required',
        ];

        $validator =  Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->errorResponse($validator->errors());
        }

        $checkCode =  AllowanceCategory::where('code', $request->code)->first();

        if ($checkCode) {
            return $this->errorResponse('this code ' . $request->code . ' has been using ');
        }

        DB::beginTransaction();

        try {
            $allowanceCategory = new AllowanceCategory();
            $allowanceCategory->name =  $request->name;
            $allowanceCategory->code = $request->code;

            $allowanceCategory->save();

            DB::commit();

            return $this->successResponse($allowanceCategory, 'Successfully created allowance category', 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->errorResponse($e);
        }
        //
    }

    public function updateAPI($id, Request $request)
    {
        $rules = [
            'name' => 'required',
            // 'code' => 'required',
        ];

        $validator =  Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->errorResponse($validator->errors());
        }

        // $checkCode =  AllowanceCategory::where('code', $request->code)->first();

        // if ($checkCode) {
        //     return $this->errorResponse('this code ' . $request->code . ' has been using ');
        // }

        DB::beginTransaction();

        try {
            $allowanceCategory = AllowanceCategory::find($id);
            $allowanceCategory->name =  $request->name;

            $allowanceCategory->save();

            DB::commit();

            return $this->successResponse($allowanceCategory, 'Successfully created allowance category', 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->errorResponse($e);
        }
        //
    }

    /**
     * Show the specified resource.
     */
    public function showAPI($id)
    {
        $findData  = AllowanceCategory::find($id);

        return $this->successResponse($findData);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('businesstrip::edit');
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
