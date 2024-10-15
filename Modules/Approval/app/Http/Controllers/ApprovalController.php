<?php

namespace Modules\Approval\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Approval\Models\ApprovalRoute;
use Modules\Approval\Models\ApprovalRouteUsers;

class ApprovalController extends Controller
{
    public function index(Request $request)
    {
        $filterableColumns = [
            'group_id',
            'is_hr',
            'hr_approval',
        ];
        $data = $this->filterAndPaginate($request, ApprovalRoute::class, $filterableColumns);
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
            $approvalRouteData = $request->only(['group_id', 'is_hr', 'hr_approval', 'user_hr_id', 'is_conditional', 'nominal']);
            $approvalRoute = ApprovalRoute::create($approvalRouteData);

            // Ambil array user_id dari request
            $userIds = $request->get('user_approvals');

            // Looping untuk insert user_id ke user_approvals
            foreach ($userIds as $userId) {
                if (isset($userId['user_id'])) {
                    ApprovalRouteUsers::create([
                        'user_id' => $userId['user_id'],
                        'approval_route_id' => $approvalRoute->id
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
        $data = ApprovalRoute::with('userApprovals')->find($id);
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
        $approvalRoute = ApprovalRoute::findOrFail($id);

        // Update data approval_routes
        $approvalRouteData = $request->only(['group_id', 'is_hr', 'hr_approval', 'user_hr_id', 'is_conditional', 'nominal']);
        $approvalRoute->update($approvalRouteData);

        // Ambil array user_id dari request
        $userIds = $request->get('user_approvals');

        // Hapus user_approvals yang lama terkait approval_route ini
        ApprovalRouteUsers::where('approval_route_id', $approvalRoute->id)->delete();

        // Insert user_id baru ke user_approvals
        foreach ($userIds as $userId) {
            ApprovalRouteUsers::create([
                'user_id' => $userId['user_id'],
                'approval_route_id' => $approvalRoute->id
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
        $data = ApprovalRoute::find($id)->delete();
        return $this->successResponse($data);
    }
}
