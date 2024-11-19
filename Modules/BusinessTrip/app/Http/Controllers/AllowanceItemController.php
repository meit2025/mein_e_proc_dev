<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Modules\BusinessTrip\Models\AllowanceCategory;
use Modules\BusinessTrip\Models\AllowanceItem;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\BusinessTrip\Models\BusinessTripGrade;
use Modules\BusinessTrip\Models\BusinessTripGradeAllowance;
use Modules\BusinessTrip\Models\PurposeTypeAllowance;
use Modules\Master\Models\MasterMaterial;

class AllowanceItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {



        $listAllowanceCategory = AllowanceCategory::get();
        $listCurrency =  Currency::get();
        $listGrade =  BusinessTripGrade::get();


        return inertia('BusinessTrip/AllowanceItem/index', compact('listAllowanceCategory', 'listCurrency', 'listGrade',));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('businesstrip::create');
    }

    public function listAPI(Request $request)
    {

        $query =  AllowanceItem::query()->with(['allowanceCategory']);



        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);


        $data = $query->paginate($perPage);

        // dd($data);
        $data->getCollection()->transform(function ($map) {
            $gradeRelations = collect($map->allowanceGrades)->map(function ($relation) {

                if ($relation->grade) {
                    return 'Grade ' . ($relation->grade ? $relation->grade->grade : '') . ": " . $relation->plafon;
                }

                return '';
            })->toArray();

            $purposeTypeRelations = collect($map->allowancePurposeType)->map(function ($relation) {
                return  $relation->purposeType->name;
            })->toArray();
            return [
                'id' => $map->id,
                'code' => $map->code,
                'name' => $map->name,
                'category' => $map->allowanceCategory ? $map->allowanceCategory->name : '',
                'currency' => $map->currency_id,
                'type' => strtoupper($map->type),
                'purpose_type' => join(' , ', $purposeTypeRelations),
                'grade_option' => $map->grade_option,
                'plafon' => ($map->grade_option == 'all') ? $map->grade_all_price : join(" , ", $gradeRelations),
                'material_number' => $map->material_number,
                'material_group' => $map->material_group,
            ];
        });



        return $this->successResponse($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('businesstrip::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('businesstrip::edit');
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

    public function storeAPI(Request $request)
    {

        $rules = [
            'allowance_category_id' => 'required',
            'code' => 'required',
            'name' => 'required',
            'request_value' => 'required',
            'currency_id' => 'required',
            'type' => 'required',
            // 'formula' => 'required',
            'grade_option' => 'required',
            'material_number' => 'required',
            'material_group' => 'required'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->errorResponse('error', 400, $validator->errors());
        }

        $checkCode =  AllowanceItem::where('code', $request->code)->first();

        if ($checkCode) {
            return $this->errorResponse($request->code . ' has been using', 400);
        }


        DB::beginTransaction();

        try {
            $store =  new AllowanceItem();

            $store->currency_id = $request->currency_id;
            $store->code = $request->code;
            $store->material_number = $request->material_number;
            $store->material_group = $request->material_group;
            $store->name = $request->name;
            $store->request_value = $request->request_value;
            $store->allowance_category_id = $request->allowance_category_id;
            $store->currency_id = $request->currency_id;
            // $store->formula = $request->formula;
            $store->grade_option = $request->grade_option;
            $store->grade_all_price = $request->grade_all_price;


            $store->type = $request->type;

            $store->save();

            $grades = [];

            foreach ($request->grades as $grade) {
                array_push($grades, [
                    'grade_id' => $grade['id'],
                    'allowance_item_id' => $store->id,
                    'plafon' => $grade['plafon']

                ]);
            }
            BusinessTripGradeAllowance::insert($grades);
            DB::commit();
            return $this->successResponse("Successfully created allowance item");
        } catch (\Exception  $e) {
            dd($e);

            DB::rollBack();
        }
    }

    public function detailAPI($id)
    {
        $allowance = AllowanceItem::find($id);
        $grades = BusinessTripGradeAllowance::with('grade')
            ->where('allowance_item_id', $id)->get()
            ->transform(function ($map) {
                return [
                    'id' => $map->grade_id,
                    'grade' => $map->grade ? $map->grade->grade : '',
                    'allowance_item_id' => $map->allowance_item_id,
                    'plafon' => $map->plafon
                ];
            });
        $context = [
            'allowance' => $allowance,
            'grades' => $grades
        ];
        return $this->successResponse($context);
    }

    public function deleteAPI($id)
    {
        DB::beginTransaction();
        try {
            $AllowanceItem =  AllowanceItem::find($id);
            $AllowanceItem->delete();

            PurposeTypeAllowance::where('allowance_items_id', $id)->delete();
            BusinessTripGradeAllowance::where('allowance_item_id', $id)->delete();

            DB::commit();

            return $this->successResponse([], 'Successfully delete Allowance item');
        } catch (\Exception  $e) {
            DB::rollBack();

            return $this->errorResponse($e);
        }
    }


    public function updateAPI($id, Request $request)
    {

        $rules = [
            'allowance_category_id' => 'required',
            // 'code' => 'required',
            'name' => 'required',
            'request_value' => 'required',
            'currency_id' => 'required',
            'type' => 'required',
            // 'formula' => 'required',
            'grade_option' => 'required',
            'material_number' => 'required',
            'material_group' => 'required'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->errorResponse('error', 400, $validator->errors());
        }

        DB::beginTransaction();
        try {
            $store = AllowanceItem::find($id);

            $store->currency_id = $request->currency_id;
            // $store->code = $request->code;
            $store->material_number = $request->material_number;
            $store->material_group = $request->material_group;
            $store->name = $request->name;
            $store->request_value = $request->request_value;
            $store->allowance_category_id = $request->allowance_category_id;
            $store->currency_id = $request->currency_id;
            // $store->formula = $request->formula;
            $store->grade_option = $request->grade_option;
            $store->grade_all_price = $request->grade_all_price;


            $store->type = $request->type;

            $store->save();
            BusinessTripGradeAllowance::where('allowance_item_id', $id)->delete();
            $grades = [];
            foreach ($request->grades as $grade) {
                array_push($grades, [
                    'grade_id' => $grade['id'],
                    'allowance_item_id' => $store->id,
                    'plafon' => $grade['plafon']

                ]);
            }
            BusinessTripGradeAllowance::insert($grades);
            DB::commit();
            return $this->successResponse("Successfully created allowance item");
        } catch (\Exception  $e) {
            dd($e);

            DB::rollBack();
        }
    }
}
