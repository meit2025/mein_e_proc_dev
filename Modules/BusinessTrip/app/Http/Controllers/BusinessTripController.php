<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\SapJobs;
use App\Models\Currency;
use App\Models\User;
use Carbon\Carbon;
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
use Modules\BusinessTrip\Models\Destination;
use Modules\BusinessTrip\Models\PurposeType;
use Modules\BusinessTrip\Models\PurposeTypeAllowance;
use Modules\Master\Models\MasterCostCenter;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\PurchasingGroup;
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
        $pajak = Pajak::select('id', 'mwszkz', 'desimal')->get();
        $costcenter = MasterCostCenter::select('id', 'cost_center', 'controlling_name')->get();
        $purchasingGroup = PurchasingGroup::select('id', 'purchasing_group')->get();

        $listDestination = Destination::get();
        return Inertia::render('BusinessTrip/BusinessTrip/index', compact('users', 'listPurposeType', 'pajak', 'costcenter', 'purchasingGroup', 'listDestination'));
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
        $findData  = BusinessTrip::with(
            [
                'requestFor',
                'requestedBy',
                'purposeType',
                'costCenter',
                'pajak',
                'purchasingGroup',
                'attachment',
                'businessTripDestination',
                'businessTripDestination.detailAttendance',
                'businessTripDestination.detailDestinationDay',
                'businessTripDestination.detailDestinationDay.allowance',
                'businessTripDestination.detailDestinationTotal',
                'businessTripDestination.detailDestinationTotal.allowance'
            ]
        )->where('id', $id)->first();
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
        try {
            DB::beginTransaction();

            $yearMonth = now()->format('Y-m');
            $prefix = "ODR-{$yearMonth}-";
            // Ambil urutan terakhir berdasarkan bulan dan tahun
            $latestOrder = BusinessTrip::where('request_no', 'like', "$prefix%")
                ->latest('id')
                ->where('type', 'request')
                ->first();
            // Ambil nomor urut terakhir, atau mulai dari 1 jika belum ada
            $sequence = $latestOrder ? (int)substr($latestOrder->code, -8) + 1 : 1;
            // Format menjadi 8 digit
            $sequence = str_pad($sequence, 8, '0', STR_PAD_LEFT);

            $businessTrip = BusinessTrip::create([
                'request_no' => $prefix . $sequence,
                'purpose_type_id' => $request->purpose_type_id,
                'request_for' => $request->request_for,
                'cost_center_id' => $request->cost_center_id,
                'pajak_id' => $request->pajak_id,
                'purchasing_group_id' => $request->purchasing_group_id,
                'remarks' => $request->remark,
                'total_destination' => $request->total_destination,
                'created_by' => auth()->user()->id,
                'type' => 'request',
                'cash_advance' => $request->cash_advance == "true" ? 1 : 0,
                'total_percent' => $request->total_percent,
                'total_cash_advance' => $request->total_cash_advance,
            ]);

            if ($request->attachment != null) {
                BusinessTripAttachment::create([
                    'business_trip_id' => $businessTrip->id,
                    'file_path' => explode('/', $request->attachment->store('business_trip', 'public'))[0],
                    'file_name' => explode('/', $request->attachment->store('business_trip', 'public'))[1],
                ]);
            }

            foreach ($request->destinations as $key => $value) {
                $data_destination = json_decode($value, true);
                $businessTripDestination = BusinessTripDestination::create([
                    'business_trip_id' => $businessTrip->id,
                    'destination' => $data_destination['destination'],
                    'business_trip_start_date' => date('Y-m-d', strtotime($data_destination['business_trip_start_date'])),
                    'business_trip_end_date' => date('Y-m-d', strtotime($data_destination['business_trip_end_date'])),
                ]);
                foreach ($data_destination['detail_attedances'] as $key => $destination) {
                    $businessTripDetailAttedance = BusinessTripDetailAttedance::create([
                        'business_trip_destination_id' => $businessTripDestination->id,
                        'business_trip_id' => $businessTrip->id,
                        'date' => date('Y-m-d', strtotime($destination['date'])),
                        'shift_code' => $destination['shift_code'],
                        'shift_start' => $destination['shift_start'],
                        'shift_end' => $destination['shift_end'],
                        'start_time' => $destination['start_time'],
                        'end_time' => $destination['end_time'],
                    ]);
                }
                foreach ($data_destination['allowances'] as $key => $allowance) {
                    if (strtolower($allowance['type']) == 'total') {
                        foreach ($allowance['detail'] as $detail) {
                            BusinessTripDetailDestinationTotal::create([
                                'business_trip_destination_id' => $businessTripDestination->id,
                                'business_trip_id' => $businessTrip->id,
                                'price' => $detail['request_price'],
                                'allowance_item_id' => AllowanceItem::where('code', $allowance['code'])->first()?->id,
                                'standard_value' => $allowance['subtotal'],
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
                                'standard_value' => $allowance['subtotal'],
                            ]);
                        }
                    }
                }
            }

            DB::commit();
            SapJobs::dispatch($businessTrip->id, 'BT');
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
        $sortDirection = $request->get('sort_direction', 'desc');

        // $query->orderBy($sortBy, $sortDirection);

        $data = $query->where('type', 'request')->latest()->paginate($perPage);

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

    function printAPI($id)
    {
        $data = BusinessTrip::find($id);
        $standar_value = PurposeTypeAllowance::where('purpose_type_id', $data->purpose_type_id)->get();
        return view('print', compact('data'));
    }
}
