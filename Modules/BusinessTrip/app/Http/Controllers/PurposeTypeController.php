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
        return $this->successResponse($find);
    }

    public function storeApi(Request $request)
    {

        $rules = [
            'code' => 'required',
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

            $purpose->save();

            $allowances = [];

            foreach ($allowances as $allowance_id) {
                array_push($allowances, [
                    'allowance_items_id' => $allowance_id,
                    'purpose_type_id' => $purpose->id
                ]);
            }

            PurposeTypeAllowance::insert($allowances);

            DB::commit();

            return $this->successResponse($purpose, 'Successfully creeted purpose type');
        } catch (\Exception $e) {
            dd($e);

            DB::rollBack();
        }
    }

    public function getAllowanceByPurposeAPI($id, $userid)
    {
        $listAllowances =  AllowanceItem::whereIn('id', PurposeTypeAllowance::where('purpose_type_id', $id)->get()->pluck('allowance_items_id')->toArray())->get();
        foreach ($listAllowances as $allowance) {
            if ($allowance->grade_option == 'all') {
                $listAllowances->grade_all_price = $allowance->grade_all_price;
            } else {
                // get grade user
                $grade = BusinessTripGradeUser::where('user_id', $userid)->first();
                if (is_null($grade)) {
                    $listAllowances->grade_all_price = 0;
                } else {
                    $btgradeAllowance = BusinessTripGradeAllowance::where('grade_id', $grade->grade_id)->where('allowance_items_id', $allowance->id)->first();
                    $listAllowances->grade_all_price = $btgradeAllowance->plafon;
                }
            }
        }
        return $this->successResponse($listAllowances);
    }
}
