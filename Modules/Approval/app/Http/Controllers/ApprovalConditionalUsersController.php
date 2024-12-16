<?php

namespace Modules\Approval\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Approval\Models\ApprovalConditionalUsers;
use Modules\Approval\Models\ApprovalConditionalUsersRoute;
use Modules\Approval\Models\ApprovalConditionalUsersToUser;

class ApprovalConditionalUsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterableColumns = [
            'name',
            'description'
        ];
        $data = $this->filterAndPaginate($request, ApprovalConditionalUsers::with(['routes']), $filterableColumns);
        return $this->successResponse($data);
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
        DB::beginTransaction();
        try {
            //code...
            $approvalRouteData = $request->only([
                'name',
                'description',
            ]);
            $approvalRoute = ApprovalConditionalUsers::create($approvalRouteData);

            // Ambil array user_id dari request
            $userIds = $request->get('routes');

            // Looping untuk insert user_id ke user_approvals
            foreach ($userIds as $userId) {
                if (isset($userId['user_id'])) {
                    ApprovalConditionalUsersRoute::create([
                        'user_id' => $userId['user_id'],
                        'approval_conditional_users_id' => $approvalRoute->id
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
        $data = ApprovalConditionalUsers::with('routes')->find($id);
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
        $approvalRoute = ApprovalConditionalUsers::findOrFail($id);

        // Update data approval_routes
        $approvalRouteData = $request->only([
            'name',
            'dscription',
        ]);
        $approvalRoute->update($approvalRouteData);

        // Ambil array user_id dari request
        $userIds = $request->get('routes');

        // Hapus user_approvals yang lama terkait approval_route ini
        ApprovalConditionalUsersRoute::where('approval_conditional_users_id', $approvalRoute->id)->delete();

        // Insert user_id baru ke user_approvals
        foreach ($userIds as $userId) {
            ApprovalConditionalUsersRoute::create([
                'user_id' => $userId['user_id'],
                'approval_conditional_users_id' => $approvalRoute->id
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
        $data = ApprovalConditionalUsers::find($id)->delete();
        return $this->successResponse($data);
    }

    public function storeToUser(Request $request)
    {
        try {
            //code...
            $userIds = $request->input('user_ids');
            $approvalRouteId = $request->input('approval_conditional_users_id');

            // Proses penyimpanan data
            ApprovalConditionalUsersToUser::where('approval_conditional_users_id', $approvalRouteId)->delete();
            foreach ($userIds as $userId) {
                ApprovalConditionalUsersToUser::create(
                    [
                        'user_id' => $userId,
                        'approval_conditional_users_id' => $approvalRouteId,
                    ],
                );
            }
            return $this->successResponse($request->all());
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    public function getUsersDropdown($id)
    {
        try {
            //code...
            $dataUserExsit =  ApprovalConditionalUsersToUser::pluck('user_id')->toArray();
            $data =  ApprovalConditionalUsersToUser::select('users.id as value', 'users.name as label')
                ->leftJoin('users', 'users.id', '=', 'approval_conditional_users_to_users.user_id')
                ->where('approval_conditional_users_to_users.approval_conditional_users_id', $id)
                ->get();

            $users = User::select('id as value', 'name as label')->whereNotIn('id', $dataUserExsit)->get();

            return $this->successResponse([
                'users' => $users,
                'data' => $data
            ]); // return response
        } catch (\Throwable $th) {
            //throw $th;
            return $this->errorResponse($th->getMessage());
        }
    }
}
