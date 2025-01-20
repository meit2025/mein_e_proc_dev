<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Modules\Master\Services\MasterTypeReimburseUserAssignServices;
use Modules\Master\Models\MasterTypeReimburse;
use Modules\Master\Models\MasterTypeReimburseUserAssign;

class MasterTypeReimburseUserAssignController extends Controller
{
    public function list(Request $request, $reimburseTypeId)
    {
        try {
            $dataReimburseType  = MasterTypeReimburse::with(['reimburseTypeUserAssign', 'reimburseTypeGrades.grade.gradeUsers'])->find($reimburseTypeId);
            $userAssign         = $dataReimburseType->reimburseTypeUserAssign->pluck('user_id')->toArray();
            $userAssignId       = $dataReimburseType->reimburseTypeUserAssign->select('id', 'user_id', 'is_assign')->toArray();
            
            if ($dataReimburseType->grade_option == 'all') {
                $query = User::query();
                if ($request->search) {
                    $query = $query->where('name', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('nip', 'ILIKE', '%' . $request->search . '%');
                }
            }else {
                $userId     = $dataReimburseType->reimburseTypeGrades->map(function ($grade) {
                    return $grade->grade->gradeUsers->pluck('user_id')->toArray();
                });
                $userId = array_merge(...$userId);
                
                $query = User::query()->whereIn('id', $userId);
                if ($request->search) {
                    $query = $query->where('name', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('nip', 'ILIKE', '%' . $request->search . '%');
                }
            }
            
            $perPage = $request->get('per_page', 10);
            $sortBy = $request->get('sort_by', 'name');
            $sortDirection = $request->get('sort_direction', 'asc');
            $query->orderBy($sortBy, $sortDirection);
            $data = $query->paginate($perPage);
            $data->getCollection()->transform(function ($map) use($dataReimburseType, $userAssign, $userAssignId) {
                if ($dataReimburseType->grade_option == 'all') {
                    $grade      = 'All Grade';
                    $balance    = $dataReimburseType->grade_all_price;
                } else {
                    $grade = '-';
                    foreach ($dataReimburseType->reimburseTypeGrades as $gradeItem) {
                        if (in_array($map['id'], $gradeItem->grade->gradeUsers->pluck('user_id')->toArray())) {
                            $grade      = $gradeItem->grade->grade;
                            $balance    = $gradeItem->plafon;
                            break;
                        }
                    }
                }
                $checkUserAssignId      = array_search($map['id'], array_column($userAssignId, 'user_id'));
                $checkUserAssignStatus  = $checkUserAssignId !== false ? $userAssignId[$checkUserAssignId]['is_assign'] : false; 
                
                return [
                    'id'            => $map['id'],
                    'name'          => ucwords($map['name']),
                    'nip'           => $map['nip'],
                    'grade'         => $grade,
                    'balancePlafon' => $balance,
                    'userAssignId'  => $checkUserAssignId !== false ? $userAssignId[$checkUserAssignId]['id'] : null,
                    'isAssign'      => in_array($map['id'], $userAssign) && $checkUserAssignStatus !== false ? true : false
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
    public function index($reimburseTypeId)
    {
        try {
            $reimburseType = MasterTypeReimburse::find($reimburseTypeId);
            return Inertia::render(
                'Master/MasterReimburseTypeUserAssign/Index',
                compact('reimburseType')
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
        
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {

    }

    public function updateUserAssign(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $userId             = $request->input('userId');
            $reimburseTypeId    = $request->input('reimburseTypeId');
            $checkStatus        = $request->input('checkStatus');

            if ($id == 0) {
                $assignmentData = MasterTypeReimburseUserAssign::create([
                    'reimburse_type_id' => $reimburseTypeId,
                    'user_id'           => $userId
                ]);
            } else {
                $assignmentData = MasterTypeReimburseUserAssign::find($id);
                $assignmentData->is_assign = $checkStatus == "true" ? false : true;
                $assignmentData->save();
            }
            
            $data = [
                'isAssign'      => $assignmentData->is_assign,
                'userAssignId'  => $id
            ];

            DB::commit();
            return $this->successResponse($data, 'Success, Status User Assign Has Been Updated');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function updateBatchUserAssign(Request $request)
    {
        DB::beginTransaction();
        try {
            $reimburseTypeId    = $request->input('reimburseTypeId');
            $checkStatus        = $request->input('checkStatus');

            MasterTypeReimburseUserAssign::where('reimburse_type_id', $reimburseTypeId)
            ->update(['is_assign' => $checkStatus == '0' ? false : true]);

            // input user when data not exist in reimburse type user assign
            MasterTypeReimburseUserAssignServices::insertBatchMasterTypeReimburseUserAssign($reimburseTypeId);
            
            DB::commit();
            return $this->successResponse([], 'Success, Status User Assign Has Been Updated');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
}