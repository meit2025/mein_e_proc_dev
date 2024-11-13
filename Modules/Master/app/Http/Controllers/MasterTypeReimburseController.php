<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Modules\BusinessTrip\Models\BusinessTripGrade;
use Modules\Master\Models\MasterTypeReimburse;
use Modules\Master\Models\MasterTypeReimburseGrades;
use Modules\Master\Models\MasterMaterial;
use Modules\Master\Models\MaterialGroup;


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
            $data = $query->paginate($perPage);
            $data->getCollection()->transform(function ($map) {
                $gradeRelations = collect($map->reimburseTypeGrades)->map(function ($relation) {
                    if ($relation->grade) {
                        return 'Grade ' . ($relation->grade ? $relation->grade->grade : '') . ": " . $relation->plafon;
                    }

                    return '';
                })->toArray();
                return [
                    'id' => $map->id,
                    'code' => $map->code,
                    'is_employee' => $map->is_employee ? 'Employee' : 'Family',
                    'material_group' => $map->materialGroup->material_group,
                    'material_number' => $map->masterMaterial->material_number,
                    'grade_option' => $map->grade_option,
                    'plafon' => ($map->grade_option == 'all') ? $map->grade_all_price : join(" , ", $gradeRelations),
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
            $listGrades             = BusinessTripGrade::select('id', 'grade')->get();
            $listMaterialNumber     = MasterMaterial::get();
            $listMaterialGroup      = MaterialGroup::get();


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
            'limit' => 'required|min:1|numeric',
            'is_employee' => 'required|boolean',
            'material_group' => 'required',
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
            $validatedData  = $validator->validated();
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
            $groups             = MasterTypeReimburse::find($id);
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
            'limit' => 'required|min:1|numeric',
            'is_employee' => 'required|boolean',
            'material_group' => 'required',
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
            MasterTypeReimburseGrades::where('reimburse_type_id', $id)->delete();
            MasterTypeReimburse::find($id)->delete();

            DB::commit();

            return $this->successResponse([], 'Delete Reimburse Type Successfully');
        } catch (\Exception  $e) {
            DB::rollBack();
            return $this->errorResponse($e);
        }
    }
}
