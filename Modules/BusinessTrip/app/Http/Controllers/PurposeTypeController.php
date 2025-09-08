<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Modules\BusinessTrip\Models\AllowanceItem;
use Modules\BusinessTrip\Models\BusinessTripGradeAllowance;
use Modules\BusinessTrip\Models\BusinessTripGradeUser;
use Modules\BusinessTrip\Models\PurposeType;
use Modules\BusinessTrip\Models\PurposeTypeAllowance;

class PurposeTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {


        $listAllowance = AllowanceItem::get();
        return inertia('BusinessTrip/PurposeType/index', compact('listAllowance'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('businesstrip::create');
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

    public function detailAPI($id)
    {
        $find = PurposeType::with(['listAllowance'])->find($id);

        $purpose =  PurposeType::find($id);
        $purposeTypeAllowances =  PurposeTypeAllowance::where('purpose_type_id', $id)->get()->transform(function ($transform) {
            return $transform->allowance_items_id;
        });

        $context = [
            'purpose' => $purpose,
            'allowances' => $purposeTypeAllowances
        ];
        return $this->successResponse($context);
    }

    public function listAPI(Request $request)
    {

        $query =  PurposeType::query()->with(['listAllowance']);

        if ($request->search) {
            $query = $query->where('code', 'ilike', '%' . $request->search . '%')
                ->orWhere('name', 'ilike', '%' . $request->search . '%')
                ->orWhereHas('listAllowance', function ($query) use ($request) {
                    $query->whereHas('allowanceItem', function ($query) use ($request) {
                        $query->where('name', 'ilike', '%' . $request->search . '%');
                    });
                });
        }

        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);


        $data = $query->paginate($perPage);

        // dd($data);
        $data->getCollection()->transform(function ($map) {


            $allowanceTypeRelations = collect($map->listAllowance)->map(function ($relation) {
                return  $relation->allowanceItem->name;
            })->toArray();
            return [
                'id' => $map->id,
                'code' => $map->code,
                'name' => $map->name,
                'allowances' => join(' , ', $allowanceTypeRelations)
            ];
        });



        return $this->successResponse($data);
    }

    public function storeApi(Request $request)
    {

        $rules = [
            'code' => 'required:unique',
            'name' => 'required',
            'allowances.*' => 'required',
            'attedance_status' => 'required'
        ];

        $validator =  Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->errorResponse('erorr created', 400, $validator->errors());
        }

        DB::beginTransaction();

        try {
            $purpose =  new PurposeType();

            $purpose->code =  $request->code;
            $purpose->name = $request->name;
            $purpose->attedance_status = $request->attedance_status;
            $purpose->type = $request->type;

            $purpose->save();

            $allowances = [];

            foreach ($request->allowances as $allowance_id) {
                array_push($allowances, [
                    'allowance_items_id' => $allowance_id,
                    'purpose_type_id' => $purpose->id
                ]);
            }

            PurposeTypeAllowance::insert($allowances);

            DB::commit();

            return $this->successResponse($purpose, 'Successfully creeted Destination');
        } catch (\Exception $e) {

            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function updateAPI($id, Request $request)
    {

        $rules = [
            // 'code' => 'required',
            'name' => 'required',
            'allowances.*' => 'required',
            'attedance_status' => 'required'
        ];

        $validator =  Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->errorResponse('erorr created', 400, $validator->errors());
        }

        DB::beginTransaction();

        try {
            PurposeTypeAllowance::where('purpose_type_id', $id)->delete();

            $purpose = PurposeType::find($id);

            // $purpose->code =  $request->code;
            $purpose->name = $request->name;
            $purpose->attedance_status = $request->attedance_status;
            $purpose->type = $request->type;
            $purpose->save();
            $allowances = [];
            foreach ($request->allowances as $allowance_id) {
                array_push($allowances, [
                    'allowance_items_id' => $allowance_id,
                    'purpose_type_id' => $purpose->id
                ]);
            }

            PurposeTypeAllowance::insert($allowances);

            DB::commit();

            return $this->successResponse($purpose, 'Successfully update Destination');
        } catch (\Exception $e) {

            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getAllowanceByPurposeAPI($id, $userid)
    {
        $listPurposeType = PurposeTypeAllowance::where('purpose_type_id', $id)->get()->pluck('allowance_items_id')->toArray();
        $listAllowances =  AllowanceItem::whereIn('id', $listPurposeType)->get();
        $mapAllowances = $listAllowances->map(function ($allowance)use($userid) {
            $grade_price = 0;

            if ($allowance->grade_option === 'all') {
                $grade_price = $allowance->grade_all_price;
            } elseif ($allowance->grade_option === 'grade') {
                $grade_user = BusinessTripGradeUser::where('user_id', $userid)->first();

                if (!is_null($grade_user)) {
                    $grade_allowance = BusinessTripGradeAllowance::where('grade_id', $grade_user->grade_id)
                                                                ->where('allowance_item_id', $allowance->id)
                                                                ->first();

                    if (!is_null($grade_allowance)) {
                        $grade_price = $grade_allowance->plafon;
                    }
                }
            }

            return [
                'id' => $allowance->id,
                'type' => $allowance->type,
                'fixed_value' => $allowance->fixed_value,
                'max_value' => $allowance->max_value,
                'request_value' => $allowance->request_value,
                'formula' => $allowance->formula,
                'currency_id' => $allowance->currency_id,
                'allowance_category_id' => $allowance->allowance_category_id,
                'code' => $allowance->code,
                'name' => $allowance->name,
                'grade_option' => $allowance->grade_option,
                'grade_all_price' => $allowance->grade_all_price,
                'material_number' => $allowance->material_number,
                'material_group' => $allowance->material_group,
                'grade_price' => $grade_price,
            ];
        });
        // foreach ($listAllowances as $allowance) {
        //     if ($allowance->grade_option === 'all') {
        //         $grade_price = $allowance->grade_all_price;
        //     } elseif ($allowance->grade_option === 'grade') {
        //         $grade_user = BusinessTripGradeUser::where('user_id', $userid)->first();
        //         if (!is_null($grade_user)) {
        //             $grade_allowance = BusinessTripGradeAllowance::where('grade_id', $grade_user->grade_id)->where('allowance_item_id', $allowance->id)->first();
        //             if (!is_null($grade_allowance)) {
        //                 $grade_price = $grade_allowance->plafon;
        //             } else {
        //                 $grade_price = 0;
        //             }
        //         } else {
        //             $grade_price = 0;
        //         }
        //     }
        //     $allowance->grade_price = $grade_price;
        // }
        return $this->successResponse($mapAllowances);
    }

    public function deleteAPI($id)
    {
        DB::beginTransaction();
        try {
            $findPurposeType =  PurposeType::find($id);
            $findPurposeType->delete();

            PurposeTypeAllowance::where('purpose_type_id', $id)->delete();

            DB::commit();

            return $this->successResponse([], 'Successfully delete Destination');
        } catch (\Exception  $e) {
            DB::rollBack();

            return $this->errorResponse($e);
        }
    }

    function checkUniqueCode($code) {
        $data = PurposeType::where('code', $code)->first();
        if (!is_null($data)) {
            return response()->json(['msg'=>'already']);
        }
        return response()->json(['msg'=>'ready']);
    }
}
