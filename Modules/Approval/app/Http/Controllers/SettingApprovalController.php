<?php

namespace Modules\Approval\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Approval\Models\SettingApproval;

class SettingApprovalController extends Controller
{
    public function index(Request $request)
    {
        $filterableColumns = [
            'titel',
            'key',
            'is_active',
            'value',
        ];
        $data = $this->filterAndPaginate($request, SettingApproval::class, $filterableColumns);
        return $this->successResponse($data);
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
        DB::beginTransaction();
        try {
            //code...
            $SettingApprovalData = $request->all();
            SettingApproval::create($SettingApprovalData);
            DB::commit();
            return $this->successResponse($request->all());
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return $this->errorResponse($th->getMessage());
        }
        //

    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $data = SettingApproval::with('userApprovals')->find($id);
        return $this->successResponse($data);
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
        $SettingApproval = SettingApproval::findOrFail($id);
        $SettingApproval->update($request->all());

        return $this->successResponse($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $data = SettingApproval::find($id)->delete();
        return $this->successResponse($data);
    }
}
