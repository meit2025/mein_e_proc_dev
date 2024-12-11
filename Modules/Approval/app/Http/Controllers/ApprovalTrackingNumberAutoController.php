<?php

namespace Modules\Approval\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Approval\Models\ApprovalTrackingNumberAuto;

class ApprovalTrackingNumberAutoController extends Controller
{
    public function index(Request $request)
    {
        $filterableColumns = [
            'document_type_id',
            'dscription',
            'is_condition',
            'condition_type',
            'min_value',
            'max_value',
            'value',
            'master_division_id',
            'purchasing_group_id',
            'master_tracking_number_id',
        ];
        $data = $this->filterAndPaginate($request, ApprovalTrackingNumberAuto::with(['masterTrackingNumber', 'purchasingGroup']), $filterableColumns);
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
            $approvalRouteData = $request->only([
                'purchasing_group_id',
                'master_tracking_number_id',
            ]);
            ApprovalTrackingNumberAuto::create($approvalRouteData);
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
        $data = ApprovalTrackingNumberAuto::with(['masterTrackingNumber', 'purchasingGroup'])->find($id);
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
        // Cari ApprovalRoute yang akan di-update
        $approvalRoute = ApprovalTrackingNumberAuto::findOrFail($id);

        // Update data approval_routes
        $approvalRouteData = $request->only([
            'purchasing_group_id',
            'master_tracking_number_id',
        ]);
        $approvalRoute->update($approvalRouteData);

        return $this->successResponse($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $data = ApprovalTrackingNumberAuto::find($id)->delete();
        return $this->successResponse($data);
    }
}
