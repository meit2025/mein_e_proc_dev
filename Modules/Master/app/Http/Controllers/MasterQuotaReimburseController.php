<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Modules\BusinessTrip\Models\BusinessTripGradeUser;
use Modules\Master\Models\MasterPeriodReimburse;
use Modules\Master\Models\MasterQuotaReimburse;
use Modules\Master\Models\MasterQuotaReimburseUser;
use Modules\Master\Models\MasterTypeReimburse;

class MasterQuotaReimburseController extends Controller
{
    public function list(Request $request)
    {

        try {
            $query =  MasterQuotaReimburse::query()->with('quotaReimburseUsers.user', 'period', 'type');
            $perPage = $request->get('per_page', 10);
            $sortBy = $request->get('sort_by', 'id');
            $sortDirection = $request->get('sort_direction', 'asc');
            $query->orderBy($sortBy, $sortDirection);
            $data = $query->paginate($perPage);
            $data->getCollection()->transform(function ($map) {
                $map = json_decode($map);
                
                $userRelations = collect($map->quota_reimburse_users)->map(function ($relation) {
                    return $relation->user->name;
                })->toArray();
                return [
                    'id' => $map->id,
                    'period' => $map->period->code,
                    'type' => $map->type->name,
                    'users' => join(',', $userRelations),
                ];
            });
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
            $listPeriodReimburse    = MasterPeriodReimburse::get();
            $listReimburseType      = MasterTypeReimburse::get();

            $listUserInGrade = BusinessTripGradeUser::select("user_id")->pluck('user_id')->toArray();
            $listUser =  User::whereNotIn('id', $listUserInGrade)->get();


            return Inertia::render(
                'Master/MasterReimburseQuota/Index',
                compact('listPeriodReimburse', 'listReimburseType', 'listUser')
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
            'users' => 'required',
            'period' => 'required|exists:master_period_reimburses,id',
            'type' => 'required|exists:master_type_reimburses,id'
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->errorResponse($validator->errors());
        }
        DB::beginTransaction();
        try {
            $validatedData  = $validator->validated();
            $inputData      = collect($validatedData)->except('users');
            $createData     = MasterQuotaReimburse::create($inputData->toArray());
            
            if ($createData) {
                $validatedData['users'] = array_map(function($user) use($createData) {
                    return [
                        'user_id' => $user,
                        'quota_reimburses_id' => $createData->id
                    ];
                }, $validatedData['users']);

                MasterQuotaReimburseUser::insert($validatedData['users']);
            }
            DB::commit();
            return $this->successResponse("Create Reimburse Quota Successfully");
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
        try {
            $groups             = MasterQuotaReimburse::find($id);
            $groups->users      = MasterQuotaReimburseUser::where('quota_reimburses_id', $id)->get()->pluck('user_id')->toArray();
            return $this->successResponse($groups);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'users' => 'required',
            'period' => 'required|exists:master_period_reimburses,id',
            'type' => 'required|exists:master_type_reimburses,id'
        ];

        $validator  = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->errorResponse($validator->errors());
        }
        DB::beginTransaction();
        try {
            $getData        = MasterQuotaReimburse::find($id);
            $validatedData  = $validator->validated();
            $editData      = collect($validatedData)->except('users');
            
            $getData->fill($editData->toArray());
            $getData->save();

            MasterQuotaReimburseUser::where('quota_reimburses_id', $id)->delete();
            $validatedData['users'] = array_map(function($user) use($id) {
                return [
                    'user_id' => $user,
                    'quota_reimburses_id' => $id
                ];
            }, $validatedData['users']);

            MasterQuotaReimburseUser::insert($validatedData['users']);
            DB::commit();
            return $this->successResponse("Edit Reimburse Quota Successfully");
        } catch (\Exception  $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            MasterQuotaReimburse::find($id)->delete();
            MasterQuotaReimburseUser::where('quota_reimburses_id', $id)->delete();

            DB::commit();

            return $this->successResponse([], 'Delete Reimburse Quota Successfully');
        } catch (\Exception  $e) {
            DB::rollBack();
            return $this->errorResponse($e);
        }
    }
}
