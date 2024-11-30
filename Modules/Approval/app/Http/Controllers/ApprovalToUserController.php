<?php

namespace Modules\Approval\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Approval\Models\ApprovalToUser;

class ApprovalToUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('approval::index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('approval::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            //code...
            $userIds = $request->input('user_ids');
            $approvalRouteId = $request->input('approval_route_id');

            // Proses penyimpanan data
            ApprovalToUser::where('approval_route_id', $approvalRouteId)->delete();
            foreach ($userIds as $userId) {
                ApprovalToUser::create(
                    [
                        'user_id' => $userId,
                        'approval_route_id' => $approvalRouteId,
                    ],
                );
            }
            return $this->successResponse($request->all());
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('approval::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('approval::edit');
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
