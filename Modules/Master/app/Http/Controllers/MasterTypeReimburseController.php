<?php

namespace Modules\Master\Http\Controllers;

use App\Jobs\InsertBatchUserAssignmentRimburseType;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Modules\BusinessTrip\Models\BusinessTripGrade;
use Modules\BusinessTrip\Models\BusinessTripGradeUser;
use Modules\Master\Models\MasterTypeReimburse;
use Modules\Master\Models\MasterTypeReimburseGrades;
use Modules\Reimbuse\Models\Reimburse;
use App\Models\User;


class MasterTypeReimburseController extends Controller
{
    public function list(Request $request)
    {
        try {
            $query =  MasterTypeReimburse::query()->with(['masterMaterial', 'materialGroup']);
            $perPage = $request->get('per_page', 10);
            $sortBy = $request->get('sort_by', 'id');
            $sortDirection = $request->get('sort_direction', 'asc');
            $query->orderBy($sortBy, $sortDirection);

            if ($request->search) $query = $query->where('code', 'ilike', '%' . $request->search . '%')
                                    ->orWhere('name', 'ilike', '%' . $request->search . '%')
                                    ->orWhere('grade_option', 'ilike', '%' . $request->search . '%')
                                    ->orWhere('family_status', 'ilike', '%' . $request->search . '%');

            $data = $query->paginate($perPage);
            $data->getCollection()->transform(function ($map) {
                $gradeRelations = collect($map->reimburseTypeGrades)->map(function ($relation) {
                    if ($relation->grade) {
                        return 'Grade ' . ($relation->grade ? $relation->grade->grade : '') . ": " . 'Rp '. number_format($relation->plafon, 0, ',', '.');
                    }

                    return '';
                })->toArray();
                return [
                    'id' => $map->id,
                    'code' => $map->code,
                    'name' => $map->name,
                    'is_employee' => $map->is_employee ? 'Employee' : 'Family',
                    'interval_claim_period' => $map->interval_claim_period ?  $map->interval_claim_period / 365 . ' Year' : '-',
                    'material_group' => $map->materialGroup->material_group,
                    'family_status' => $map->family_status,
                    'material_number' => $map->masterMaterial->material_number,
                    'grade_option' => $map->grade_option,
                    'plafon' => ($map->grade_option == 'all') ? 'Rp '. number_format($map->grade_all_price, 0, ',', '.') : join(" , ", $gradeRelations),
                ];
            });
            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function listGradeUsers($reimburseTypeId) {
        try {
            $reimburseType          = MasterTypeReimburse::find($reimburseTypeId);
            $gradeReimburseType     = MasterTypeReimburseGrades::select('grade_id')->where('reimburse_type_id', $reimburseTypeId)->pluck('grade_id')->toArray();
            $listUserInGrade        = BusinessTripGradeUser::with('grade')
            ->select("user_id")
            ->when($gradeReimburseType, function($q) use ($gradeReimburseType) {
                return $q->whereHas('grade', function($query) use ($gradeReimburseType) {
                    $query->whereIn('id', $gradeReimburseType);
                });
            })
            ->pluck('user_id')
            ->toArray();

            $data = $reimburseType->grade_option == 'all' ? User::get() : User::whereIn('id', $listUserInGrade)->get() ;
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
            $listGrades = BusinessTripGrade::select('id', 'grade')->get();

            return Inertia::render(
                'Master/MasterReimburseType/Index',
                compact('listGrades')
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
            'code' => 'required|unique:master_type_reimburses',
            'name' => 'required',
            'limit' => '',
            'is_employee' => 'required|boolean',
            'family_status' => '',
            'interval_claim_period' => '',
            'material_group' => 'required',
            'material_number' => 'required',
            'grade_option' => 'required'
        ];
        if ($request->grade_option == 'all') $rules['grade_all_price'] = 'required';

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->errorResponse($validator->errors()->first());
        }
        DB::beginTransaction();
        try {
            $validatedData  = $validator->validated();
            $validatedData['family_status'] = $validatedData['is_employee'] == true ? null : $validatedData['family_status'];

            $createData     = MasterTypeReimburse::create($validatedData);

            if ($createData) {
                $request->grades = array_map(function ($grade) use ($createData) {
                    return [
                        'grade_id' => $grade['id'],
                        'reimburse_type_id' => $createData->id,
                        'plafon' => $grade['plafon'],
                    ];
                }, $request->grades);

                MasterTypeReimburseGrades::insert($request->grades);

                dispatch(new InsertBatchUserAssignmentRimburseType($createData->id));
            }
            DB::commit();
            return $this->successResponse("Create Reimburse Type Successfully");
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
            $groups             = MasterTypeReimburse::with('materialGroup')->find($id);
            $groups->grades     = MasterTypeReimburseGrades::with('grade')
                ->where('reimburse_type_id', $id)->get()
                ->transform(function ($map) {
                    return [
                        'id' => $map->grade_id,
                        'grade' => $map->grade ? $map->grade->grade : '',
                        'reimburse_type_id' => $map->reimburse_type_id,
                        'plafon' => $map->plafon
                    ];
                });
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
            'name' => 'required',
            'limit' => '',
            'is_employee' => 'required|boolean',
            'family_status' => '',
            'material_group' => 'required',
            'interval_claim_period' => '',
            'material_number' => 'required',
            'grade_option' => 'required'
        ];
        if ($request->grade_option == 'all') $rules['grade_all_price'] = 'required';

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return $this->errorResponse($validator->errors());
        }
        DB::beginTransaction();
        try {
            $getData        = MasterTypeReimburse::find($id);
            $validatedData  = $validator->validated();
            $validatedData['family_status'] = $validatedData['is_employee'] == true ? null : $validatedData['family_status'];
            $getData->fill($validatedData);
            $getData->save();

            MasterTypeReimburseGrades::where('reimburse_type_id', $id)->delete();
            $request->grades = array_map(function ($grade) use ($id) {
                return [
                    'grade_id' => $grade['id'],
                    'reimburse_type_id' => $id,
                    'plafon' => $grade['plafon'],
                ];
            }, $request->grades);

            MasterTypeReimburseGrades::insert($request->grades);
            DB::commit();
            return $this->successResponse("Create Reimburse Type Successfully");
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
            $dataReimburseType = MasterTypeReimburse::find($id);
            $checkReimburse = Reimburse::where('reimburse_type', $dataReimburseType->code)->first();
            if (!empty($checkReimburse)) return $this->errorResponse('Failed, Cannot delete this data because it is related to reimburse request data.');

            MasterTypeReimburseGrades::where('reimburse_type_id', $id)->delete();
            $dataReimburseType->delete();

            DB::commit();

            return $this->successResponse([], 'Delete Reimburse Type Successfully');
        } catch (\Exception  $e) {
            DB::rollBack();
            if ($e instanceof \PDOException && $e->getCode() == '23503') return $this->errorResponse('Failed, Cannot delete this data because it is related to other data.');
            return $this->errorResponse($e);
        }
    }

    public function dropdownList(Request $request)
    {
        $data = MasterTypeReimburse::selectRaw("name || ' (' || code || ')' as label, code as value");
        if ($request->search) {
            $data = $data->where('name', 'ilike', '%' . $request->search . '%')->orWhere('code', 'ilike', '%' . $request->search . '%');
        }

        $data = $data->limit(50)->get();
        return $this->successResponse($data);
    }
}
