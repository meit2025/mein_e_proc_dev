<?php

namespace Modules\Approval\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Approval\Models\ApprovalPr;
use Modules\Approval\Models\ApprovalPrRoute;

class ApprovalPrController extends Controller
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
            'master_position_id',
        ];
        $data = $this->filterAndPaginate($request, ApprovalPr::with(['masterTrackingNumber', 'approvalRoute', 'documentType', 'masterDivision', 'purchasingGroup']), $filterableColumns);
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
                'master_position_id',
            ]);

            $approvalRouteData['value'] = $request->value ?? 0;
            $approvalRoute = ApprovalPr::create($approvalRouteData);

            // Ambil array user_id dari request
            $userIds = $request->get('approval_route');

            // Looping untuk insert user_id ke user_approvals
            foreach ($userIds as $userId) {
                if (isset($userId['user_id'])) {
                    ApprovalPrRoute::create([
                        'user_id' => $userId['user_id'],
                        'approval_pr_id' => $approvalRoute->id
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
        $data = ApprovalPr::with('approvalRoute')->find($id);
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
        $approvalRoute = ApprovalPr::findOrFail($id);

        // Update data approval_routes
        $approvalRouteData = $request->only([
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
            'master_position_id',
        ]);
        $approvalRoute->update($approvalRouteData);

        // Ambil array user_id dari request
        $userIds = $request->get('approval_route');

        // Hapus user_approvals yang lama terkait approval_route ini
        ApprovalPrRoute::where('approval_pr_id', $approvalRoute->id)->delete();

        // Insert user_id baru ke user_approvals
        foreach ($userIds as $userId) {
            ApprovalPrRoute::create([
                'user_id' => $userId['user_id'],
                'approval_pr_id' => $approvalRoute->id
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
        $data = ApprovalPr::find($id)->delete();
        return $this->successResponse($data);
    }
}
