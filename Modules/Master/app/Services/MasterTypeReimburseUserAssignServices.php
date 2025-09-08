<?php

namespace Modules\Master\Services;

use App\Models\User;
use Modules\Master\Models\MasterTypeReimburse;
use Modules\Master\Models\MasterTypeReimburseUserAssign;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class MasterTypeReimburseUserAssignServices
{
    public static function insertBatchMasterTypeReimburseUserAssign($reimburseTypeId)
    {
        DB::beginTransaction();
        try {
            $dataAssignUser = MasterTypeReimburseUserAssign::where('reimburse_type_id', $reimburseTypeId)->get()->pluck('user_id')->toArray();
            $data = MasterTypeReimburse::query()->with(['reimburseTypeGrades.grade.gradeUsers' => function ($query) use ($dataAssignUser) {
                $query->whereNotIn('user_id', $dataAssignUser);
            }])
            ->find($reimburseTypeId);
            $userAssignmentData = [];

            if ($data->grade_option == 'all') {
                $userAssignment     = User::whereNotIn('id', $dataAssignUser)->get()->pluck('id')->toArray();
                $userAssignmentData = array_map(function ($userId) use ($data) {
                    return [
                        'user_id'           => $userId,
                        'reimburse_type_id' => $data->id,
                        'created_at'        => Carbon::now()->format('Y-m-d H:i:s'),
                        'updated_at'        => Carbon::now()->format('Y-m-d H:i:s')
                    ];
                }, $userAssignment);

            } else {
                $userAssignment     = $data->reimburseTypeGrades->map(function ($grade) {
                    return $grade->grade->gradeUsers->pluck('user_id')->toArray();
                });
                $userAssignment = array_merge(...$userAssignment);
                
                $userAssignmentData = array_map(function ($userId) use ($data) {
                    return [
                        'user_id'           => $userId,
                        'reimburse_type_id' => $data->id,
                        'created_at'        => Carbon::now()->format('Y-m-d H:i:s'),
                        'updated_at'        => Carbon::now()->format('Y-m-d H:i:s')
                    ];
                }, $userAssignment);
            }
            
            if (!empty($userAssignmentData)) MasterTypeReimburseUserAssign::insert($userAssignmentData);
            DB::commit();
            Log::info(json_encode([
                'message' => 'Success Insert User Assignment',
                'data'    => $userAssignmentData
            ]));
            return $userAssignmentData;
        } catch (\Exception  $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            Log::info(json_encode([
                'message' => 'Failed Insert User Assignment',
            ]));
        }
    }
}