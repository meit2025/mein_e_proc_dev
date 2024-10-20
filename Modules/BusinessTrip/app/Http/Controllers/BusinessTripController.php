<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Modules\BusinessTrip\Models\AllowanceItem;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\BusinessTrip\Models\BusinessTripAttachment;
use Modules\BusinessTrip\Models\BusinessTripDestination;
use Modules\BusinessTrip\Models\BusinessTripDetailAttedance;
use Modules\BusinessTrip\Models\BusinessTripDetailDestinationDayTotal;
use Modules\BusinessTrip\Models\BusinessTripDetailDestinationTotal;
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
    public function showAPI($id)
    {
        $findData  = BusinessTrip::find($id);
        //  attachment
        $findData->attachment = BusinessTripAttachment::where('business_trip_id', $id)->first();

        return $this->successResponse($findData);
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
            'purpose_type_id' => 'required',
            'request_for' => 'required',
            'destination.*' => 'required'
        ];

        $validator =  Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->errorResponse("erorr", 400, $validator->errors());
        }

        $destinations = json_decode($request->destinations, true);

        try {
            DB::beginTransaction();
            $businessTrip = BusinessTrip::create([
                'request_no' => '123',
                'purpose_type_id' => $request->purpose_type_id,
                'request_for' => $request->request_for,
                'remarks' => $request->remark,
                'total_destination' => $request->total_destination,
                'created_by' => auth()->user()->id,
                'type' => 'request',
            ]);

            if ($request->attachment != null) {
                BusinessTripAttachment::create([
                    'business_trip_id' => $businessTrip->id,
                    'file_path' => explode('/', $request->attachment->store('business_trip', 'public'))[0],
                    'file_name' => explode('/', $request->attachment->store('business_trip', 'public'))[1],
                ]);
            }

            $businessTripDestination = BusinessTripDestination::create([
                'business_trip_id' => $businessTrip->id,
                'destination' => $destinations['destination'],
                'business_trip_start_date' => date('Y-m-d', strtotime($destinations['business_trip_start_date'])),
                'business_trip_end_date' => date('Y-m-d', strtotime($destinations['business_trip_end_date'])),
            ]);

            foreach ($destinations['detail_attedances'] as $key => $destination) {
                $businessTripDetailAttedance = BusinessTripDetailAttedance::create([
                    'business_trip_destination_id' => $businessTripDestination->id,
                    'business_trip_id' => $businessTrip->id,
                    'date' => $destination['date'],
                    'shift_code' => $destination['shift_code'],
                    'shift_start' => $destination['shift_start'],
                    'shift_end' => $destination['shift_end'],
                    'start_time' => $destination['start_time'],
                    'end_time' => $destination['end_time'],
                ]);
            }

            foreach ($destinations['allowances'] as $key => $allowance) {
                if ($allowance['type'] == 'TOTAL') {
                    foreach ($allowance['detail'] as $detail) {
                        BusinessTripDetailDestinationTotal::create([
                            'business_trip_destination_id' => $businessTripDestination->id,
                            'business_trip_id' => $businessTrip->id,
                            'price' => $detail['request_price'],
                            'allowance_item_id' => AllowanceItem::where('code', $allowance['code'])->first()?->id,
                        ]);
                    }
                } else {
                    foreach ($allowance['detail'] as $detail) {
                        BusinessTripDetailDestinationDayTotal::create([
                            'business_trip_destination_id' => $businessTripDestination->id,
                            'date' => $detail['date'],
                            'business_trip_id' => $businessTrip->id,
                            'price' => $detail['request_price'],
                            'allowance_item_id' => AllowanceItem::where('code', $allowance['code'])->first()?->id,
                        ]);
                    }
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            dd($e);
            DB::rollBack();
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
