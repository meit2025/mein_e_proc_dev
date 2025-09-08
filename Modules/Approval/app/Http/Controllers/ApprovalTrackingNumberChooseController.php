<?php

namespace Modules\Approval\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Approval\Models\ApprovalTrackingNumberChoose;
use Modules\Approval\Models\ApprovalTrackingNumberChooseRoute;

class ApprovalTrackingNumberChooseController extends Controller
{
    public function index(Request $request)
    {
        $filterableColumns = [
            'name',
        ];
        $data = $this->filterAndPaginate($request, ApprovalTrackingNumberChoose::with(['approvalTrackingNumberRoute']), $filterableColumns);
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
                'name',
            ]);
            $approvalRoute = ApprovalTrackingNumberChoose::create($approvalRouteData);

            // Ambil array user_id dari request
            $userIds = $request->get('approval_tracking_number_route');

            // Looping untuk insert user_id ke user_approvals
            foreach ($userIds as $userId) {
                if (isset($userId['master_tracking_number_id'])) {
                    ApprovalTrackingNumberChooseRoute::create([
                        'master_tracking_number_id' => $userId['master_tracking_number_id'],
                        'approval_tracking_number_choose_id' => $approvalRoute->id
                    ]);
                }
            }

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
        $data = ApprovalTrackingNumberChoose::with('approvalTrackingNumberRoute')->find($id);
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
        $approvalRoute = ApprovalTrackingNumberChoose::findOrFail($id);

        // Update data approval_routes
        $approvalRouteData = $request->only([
            'name',
        ]);
        $approvalRoute->update($approvalRouteData);

        // Ambil array user_id dari request
        $userIds = $request->get('approval_tracking_number_route');

        // Hapus user_approvals yang lama terkait approval_route ini
        ApprovalTrackingNumberChooseRoute::where('approval_tracking_number_choose_id', $approvalRoute->id)->delete();

        // Insert user_id baru ke user_approvals
        foreach ($userIds as $userId) {
            ApprovalTrackingNumberChooseRoute::create([
                'master_tracking_number_id' => $userId['master_tracking_number_id'],
                'approval_tracking_number_choose_id' => $approvalRoute->id
            ]);
        }

        return $this->successResponse($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $data = ApprovalTrackingNumberChoose::find($id)->delete();
        return $this->successResponse($data);
    }
}
