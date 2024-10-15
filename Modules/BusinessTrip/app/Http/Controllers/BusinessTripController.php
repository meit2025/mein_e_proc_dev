<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\BusinessTrip\Models\PurposeType;
use Modules\Reimbuse\Models\Reimburse;
use Modules\Reimbuse\Models\ReimburseType;

class BusinessTripController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::select('nip', 'name', 'id')->get();

        $listPurposeType = PurposeType::select('name', 'code', 'id')->get();
        return Inertia::render('BusinessTrip/BusinessTrip/index', compact('users', 'listPurposeType'));
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

    public function storeAPI(Request $request) {

        $rules = [
            'purpose_type_id' => 'required',
            'request_for' => 'required',
            'destination.*' => 'required'
        ];

        $validator =  Validator::make($request->all(), $rules);

        if($validator->fails()){
            return $this->errorResponse("erorr", 400, $validator->errors());
        }

        DB::beginTransaction();

        try {


        }
        catch(\Exception $e) {
            dd($e);
        }
    }

    public function listAPI(Request $request)
    {

        $query =  BusinessTrip::query()->with(['purposeType']);
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');


        $query->orderBy($sortBy, $sortDirection);

        $data = $query->paginate($perPage);

        $data->getCollection()->transform(function ($map) {

            $purposeRelations = $map->purposeType ? $map->purposeType->name : ''; // Assuming 'name' is the field

            return [
                'id' => $map->id,
                'request_no' => $map->request_no,
                'purpose_type' => $purposeRelations, // You can join multiple relations here if it's an array
                'total_destination' => $map->total_destination, // You can join multiple relations here if it's an array
            ];
        });


        return $this->successResponse($data);
    }
}
