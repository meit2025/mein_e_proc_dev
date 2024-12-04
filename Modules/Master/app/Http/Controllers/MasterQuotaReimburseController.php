<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
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
                    'period' => $map->period->code. ' ( ' . $map->period->start . ' - ' . $map->period->end . ' )',
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
            return Inertia::render(
                'Master/MasterReimburseQuota/Index'
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
            'users' => '',
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

            if ($createData && !empty($validatedData['users'])) {
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
            'users' => '',
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
            if (!empty($validatedData['users'])) {
                $validatedData['users'] = array_map(function($user) use($id) {
                    return [
                        'user_id' => $user,
                        'quota_reimburses_id' => $id
                    ];
                }, $validatedData['users']);
    
                MasterQuotaReimburseUser::insert($validatedData['users']);
            }
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
            if ($e instanceof \PDOException && $e->getCode() == '23503') return $this->errorResponse('Failed, Cannot delete this data because it is related to other data.');
            return $this->errorResponse($e);
        }
    }

    public function detail($id)
    {
        $masterReimburseQuotaData = MasterQuotaReimburse::with('type', 'period')->find($id)->toArray();
        
        try {
            return Inertia::render(
                'Master/MasterReimburseQuota/Detail',
                compact('masterReimburseQuotaData')
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function detailData(Request $request, $id)
    {
        try {
            $familyStatus = null;
            $masterReimburseQuota = MasterQuotaReimburse::with('type', 'period')->find($id)->toArray();
            
            if($masterReimburseQuota['type']['is_employee'] == false) $familyStatus = $masterReimburseQuota['type']['family_status'];
            
            $balanceGrade = MasterTypeReimburse::with(['reimburseTypeGrades', 'reimburseTypeGrades.grade', 'reimburseTypeGrades.grade.gradeUsers'])->find($masterReimburseQuota['type']['id'])->toArray();
            
            if (isset($balanceGrade['reimburse_type_grades']) && is_array($balanceGrade['reimburse_type_grades'])) {
                $balanceGrade['reimburse_type_grades'] = array_map(function ($reimburseTypeGrade) {
                    $grade = $reimburseTypeGrade['grade'];
                    $reimburseTypeGrade['grade_name'] = $grade['grade'];
                    $reimburseTypeGrade['user_ids'] = array_column($grade['grade_users'], 'user_id');
                    
                    unset($reimburseTypeGrade['grade']);
            
                    return $reimburseTypeGrade;
                }, $balanceGrade['reimburse_type_grades']);
            }
            
            $query = MasterQuotaReimburse::query()
                ->join('master_quota_reimburse_users', 'master_quota_reimburse_users.quota_reimburses_id', '=', 'master_quota_reimburses.id')
                ->join('master_type_reimburses', 'master_type_reimburses.id', '=', 'master_quota_reimburses.type')
                ->join('users', 'users.id', '=', 'master_quota_reimburse_users.user_id');

            $query->when($familyStatus, function($q) {
                return $q->join('families', 'families.userId', '=', 'users.id');
            });

            $selectColumns = [
                "users.name AS employerName",
                "users.id AS userId"
            ];

            if (!empty($familyStatus)) {
                $selectColumns[] = "families.name AS familyName";
                $selectColumns[] = "families.id AS id";
            } else {
                $selectColumns[] = DB::raw("CAST('' AS TEXT) AS familyName, users.id AS id");
            }

            $query->select($selectColumns)
                ->where('master_quota_reimburses.id', $id)
                ->when($familyStatus, function($q) use ($familyStatus) {
                    return $q->where('families.status', $familyStatus);
                })
            ;
            
            $perPage = $request->get('per_page', 10);
            $sortDirection = $request->get('sort_direction', 'asc');
            $data = $query->orderBy('master_quota_reimburses.id', $sortDirection)->paginate($perPage);
            
            $data->getCollection()->transform(function ($map) use ($balanceGrade) {
                $filteredGrade = array_filter($balanceGrade['reimburse_type_grades'], function ($grade) use ($map) {
                    return in_array($map->userId, $grade['user_ids']);
                });
                $firstGrade = reset($filteredGrade);

                return [
                    'id'            => $map->id,
                    'employerName'  => $map->employerName,
                    'familyName'    => $map->familyName,
                    'plafon'        => ($balanceGrade['grade_option'] == 'all') ? $balanceGrade['grade_all_price'] : ($firstGrade ? $firstGrade['plafon'] : 0),
                    'grade'         => $firstGrade ? $firstGrade['grade_name'] : ''
                ];
            });

            // $data['type']          = $masterReimburseQuota['type']['name'];
            // $data['period']        = $masterReimburseQuota['period']['code'] . ' ( ' . $masterReimburseQuota['period']['start'] . ' - ' . $masterReimburseQuota['period']['end'] . ' )';
            // $data['employerStatus'] = $masterReimburseQuota['type']['is_employee'] ? 'Employee' : 'Family';
            // $data['familyStatus']   = $masterReimburseQuota['type']['family_status'];

            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    function dropdownPeriod(Request $request)
    {
        $data = MasterPeriodReimburse::selectRaw(
            'code || \' (\' || "start" || \' - \' || "end" || \')\' as label, id as value'
        );
        
        if ($request->search) {
            $data = $data
                    ->where('code', 'ilike', '%' . $request->search . '%')
                    ->orWhere('start', 'ilike', '%' . $request->search . '%')
                    ->orWhere('end', 'ilike', '%' . $request->search . '%');
        }

        $data = $data->limit(175)->get();
        return $this->successResponse($data);
    }
}