<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\SapJobs;
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
use Modules\BusinessTrip\Models\PurposeTypeAllowance;

class BusinessTripDeclarationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::select('nip', 'name', 'id')->get();
        $listBusinessTrip = BusinessTrip::where('type', 'request')->get();

        $listPurposeType = PurposeType::select('name', 'code', 'id')->get();
        return Inertia::render('BusinessTrip/BusinessTripDeclaration/index', compact('users', 'listPurposeType', 'listBusinessTrip'));
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
        $data = BusinessTrip::with(['costCenter', 'pajak', 'purchasingGroup'])->where('id', $id)->first();
        $data->name_request = $data->requestFor->name;
        $data->name_purpose = $data->purposeType->name;
        $destinations = [];
        foreach ($data->businessTripDestination as $key => $value) {
            // Inisialisasi array allowances dengan kunci allowance_id
            $allowances = [];
            // Mengisi data allowance dari detailDestinationDay
            foreach ($value->getDetailDestinationDay as $row) {
                $allowanceId = $row->allowance->id;
                if (!isset($allowances[$allowanceId])) {
                    $allowances[$allowanceId] = [
                        'name' => $row->allowance->name,
                        'code' => $row->allowance->code,
                        'default_price' => number_format($row->standard_value, 0, '.', ''),
                        'type' => $row->allowance->type,
                        'subtotal' => number_format($row->standard_value, 0, '.', ''),
                        'currency' => $row->allowance->currency,
                        'request_value' => $row->allowance->request_value,
                        'detail' => [] // Array untuk menampung detail
                    ];
                }

                // Tambahkan detail allowance
                $allowances[$allowanceId]['detail'][] = [
                    'date' => $row->date, // Sesuaikan dengan nama kolom tanggal di detailDestinationDay
                    'request_price' => $row->price // Sesuaikan dengan kolom request_price di detailDestinationDay
                ];
            }

            // Mengisi data allowance dari detailDestinationTotal
            foreach ($value->detailDestinationTotal as $row) {
                $allowanceId = $row->allowance->id;
                if (!isset($allowances[$allowanceId])) {
                    $allowances[$allowanceId] = [
                        'name' => $row->allowance->name,
                        'code' => $row->allowance->code,
                        'default_price' => number_format($row->standard_value, 0, '.', ''),
                        'type' => $row->allowance->type,
                        'subtotal' => number_format($row->standard_value, 0, '.', ''),
                        'currency' => $row->allowance->currency,
                        'request_value' => $row->allowance->request_value,
                        'detail' => []
                    ];
                }

                // Tambahkan detail allowance
                $allowances[$allowanceId]['detail'][] = [
                    'date' => '', // Sesuaikan dengan nama kolom tanggal di detailDestinationTotal
                    'request_price' => $row->price // Sesuaikan dengan kolom request_price di detailDestinationTotal
                ];
            }

            $allowances = array_values($allowances);

            // RESULT ITEM
            // Inisialisasi array allowances dengan kunci allowance_id
            $allowancesResultItem = [];
            // Mengisi data allowance dari detailDestinationDay
            foreach ($value->detailDestinationDay as $rowDay) {
                $allowanceId = $rowDay->allowance->id;
                if (!isset($allowancesResultItem[$allowanceId])) {
                    $allowancesResultItem[$allowanceId] = [
                        'name' => $rowDay->allowance->name,
                        'code' => $rowDay->allowance->code,
                        'default_price' => number_format($rowDay->standard_value, 0, '.', ''),
                        'type' => $rowDay->allowance->type,
                        'subtotal' => number_format($rowDay->standard_value, 0, '.', ''),
                        'currency' => $rowDay->allowance->currency,
                        'request_value' => $rowDay->allowance->request_value,
                        'detail' => [] // Array untuk menampung detail
                    ];
                }

                // Tambahkan detail allowance
                $allowancesResultItem[$allowanceId]['detail'][] = [
                    'date' => $rowDay->date, // Sesuaikan dengan nama kolom tanggal di detailDestinationDay
                    'request_price' => $rowDay->price // Sesuaikan dengan kolom request_price di detailDestinationDay
                ];
            }

            // Mengisi data allowance dari detailDestinationTotal
            foreach ($value->detailDestinationTotal as $rowTotal) {
                $allowanceId = $rowTotal->allowance->id;
                if (!isset($allowancesResultItem[$allowanceId])) {
                    $allowancesResultItem[$allowanceId] = [
                        'name' => $rowTotal->allowance->name,
                        'code' => $rowTotal->allowance->code,
                        'default_price' => number_format($rowTotal->standard_value, 0, '.', ''),
                        'type' => $rowTotal->allowance->type,
                        'subtotal' => number_format($rowTotal->standard_value, 0, '.', ''),
                        'currency' => $rowTotal->allowance->currency,
                        'request_value' => $rowTotal->allowance->request_value,
                        'detail' => []
                    ];
                }

                // Tambahkan detail allowance
                $allowancesResultItem[$allowanceId]['detail'][] = [
                    'date' => '', // Sesuaikan dengan nama kolom tanggal di detailDestinationTotal
                    'request_price' => $rowTotal->price // Sesuaikan dengan kolom request_price di detailDestinationTotal
                ];
            }

            $allowancesResultItem = array_values($allowancesResultItem);

            $detailAttendance = [];
            foreach ($value->detailAttendance as $row) {
                $detailAttendance[] = [
                    'date' => $row->date,
                    'start_time' => $row->start_time,
                    'end_time' => $row->end_time,
                    'shift_code' => $row->shift_code,
                    'shift_start' => $row->shift_start,
                    'shift_end' => $row->shift_end,
                    'request_start_time' => '08:00',
                    'request_end_time' => '17:00',
                ];
            }

            $destinations[] = [
                'destination' => $value->destination,
                'business_trip_start_date' => $value->business_trip_start_date,
                'business_trip_end_date' => $value->business_trip_end_date,
                'detail_attedances' => $detailAttendance,
                'allowances' => $allowances,
                'allowancesResultItem' => $allowancesResultItem,
            ];
        }
        $data->destinations = $destinations;
        return $this->successResponse($data->makeHidden(['created_at', 'updated_at']));
    }


    public function detailBtDeclareAPI($id)
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

    public function listAPI(Request $request)
    {

        $query =  BusinessTrip::query()->with(['purposeType']);
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');


        $query->orderBy($sortBy, $sortDirection);

        $data = $query->where('type', 'declaration')->paginate($perPage);

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


    public function storeAPI(Request $request)
    {
        $rules = [
            'destination.*' => 'required'
        ];

        $validator =  Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->errorResponse("erorr", 400, $validator->errors());
        }
        try {
            DB::beginTransaction();
            $dataBusiness = BusinessTrip::find($request->request_no);

            $businessTrip = BusinessTrip::create([
                'request_no' => time(),
                'parent_id' => $request->request_no,
                'purpose_type_id' => $dataBusiness->purpose_type_id,
                'request_for' => $dataBusiness->request_for,
                'remarks' => $request->remark,
                'total_destination' => $dataBusiness->total_destination,
                'created_by' => auth()->user()->id,
                'type' => 'declaration',
                // 'cash_advance' => $request->cash_advance == "true" ? 1 : 0,
                // 'total_percent' => $request->total_percent,
                // 'total_cash_advance' => $request->total_cash_advance,
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
                    'other_allowance' => isset($data_destination['other']) ? $data_destination['other'][0] : 0,
                ]);
                foreach ($data_destination['detail_attedances'] as $key => $destination) {
                    $businessTripDetailAttedance = BusinessTripDetailAttedance::create([
                        'business_trip_destination_id' => $businessTripDestination->id,
                        'business_trip_id' => $businessTrip->id,
                        'date' => date('Y-m-d', strtotime($destination['date'])),
                        'shift_code' => $destination['shift_code'],
                        'shift_start' => $destination['shift_start'],
                        'shift_end' => $destination['shift_end'],
                        'start_time' => $destination['request_start_time'],
                        'end_time' => $destination['request_end_time'],
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

            SapJobs::dispatch($dataBusiness->id, 'BTPO');
            DB::commit();
        } catch (\Exception $e) {
            dd($e);
            DB::rollBack();
        }
    }

    function printAPI($id)
    {
        $data = BusinessTrip::find($id);
        $standar_value = PurposeTypeAllowance::where('purpose_type_id', $data->purpose_type_id)->get();
        return view('print-bt-declaration', compact('data'));
    }
}
