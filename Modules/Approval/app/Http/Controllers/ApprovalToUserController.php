<?php

namespace Modules\Approval\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
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
            ApprovalToUser::where('approval_route_id', $approvalRouteId)
                ->where(function ($query) use ($request) {
                    if ($request->input('type') == 'reim') {
                        $query->where('is_reim', true);
                    } else {
                        $query->where('is_bt', true);
                    }
                })
                ->delete();
            foreach ($userIds as $userId) {
                ApprovalToUser::create(
                    [
                        'is_reim' => $request->input('type') == 'reim' ? true : false,
                        'is_bt' => $request->input('type') == 'bt' ? true : false,
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
     * Retrieve the dropdown list of user IDs for a specific approval route.
     *
     * This function fetches the user IDs associated with a given approval route ID and returns
     * a list of user IDs that are not already part of any approval route. It returns a success
     * response containing both the list of available user IDs and the current user IDs for the
     * specified approval route.
     *
     * @param int $id The ID of the approval route.
     * @return \Illuminate\Http\JsonResponse A JSON response with the list of available user IDs and current user IDs.
     */
    public function getUsersDropdown($id, $type)
    {
        try {
            //code...

            if ($type == 'reim') {
                $dataUserExsit = ApprovalToUser::where('is_reim', true)->pluck('user_id')->toArray();
            } else {
                $dataUserExsit =  ApprovalToUser::where('is_bt', true)->pluck('user_id')->toArray();
            }

            $data = ApprovalToUser::select('users.id as value', 'users.name as label')
                ->leftJoin('users', 'users.id', '=', 'approval_to_users.user_id')
                ->where('approval_to_users.approval_route_id', $id)
                ->when($type == 'reim', function ($q) {
                    return $q->where('approval_to_users.is_reim', true);
                }, function ($q) {
                    return $q->where('approval_to_users.is_bt', true);
                })
                ->distinct()
                ->get();

            $users = User::select('id as value', 'name as label')->whereNotIn('id', $dataUserExsit)->get();

            return $this->successResponse([
                'users' => $users,
                'data' => $data ?? [],
            ]); // return response
        } catch (\Throwable $th) {
            //throw $th;
            return $this->errorResponse($th->getMessage());
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
