<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\SapJobs;
use App\Models\Currency;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Modules\Approval\Models\Approval;
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
use Modules\Approval\Services\CheckApproval;

class BusinessTripController extends Controller
{
    protected $approvalServices;

    public function __construct(CheckApproval $approvalServices)
    {
        $this->approvalServices = $approvalServices;
    }

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
        $data = BusinessTrip::with(['costCenter', 'pajak', 'purchasingGroup'])->where('id', $id)->first();
        $data->name_request = $data->requestFor->name;
        $data->name_purpose = $data->purposeType->name;
        $attachments = $data->attachment->map(function ($attachment) {
            return [
                'id' => $attachment->id,
                'url' => asset('storage/' . $attachment->file_path . '/' . $attachment->file_name),
                'file_name' => $attachment->file_name,
            ];
        });
        $data->attachments = $attachments;
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
                        'currency' => $row->allowance->currency_id,
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
                        'currency' => $row->allowance->currency_id,
                        'request_value' => $row->allowance->request_value,
                        'detail' => []
                    ];
                }

                // Tambahkan detail allowance
                $allowances[$allowanceId]['detail'][] = [
                    'date' => null, // Sesuaikan dengan nama kolom tanggal di detailDestinationTotal
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
                        'currency' => $rowDay->allowance->currency_id,
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
                        'currency' => $rowTotal->allowance->currency_id,
                        'request_value' => $rowTotal->allowance->request_value,
                        'detail' => []
                    ];
                }

                // Tambahkan detail allowance
                $allowancesResultItem[$allowanceId]['detail'][] = [
                    'date' => null, // Sesuaikan dengan nama kolom tanggal di detailDestinationTotal
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
                ];
            }

            $destinations[] = [
                'destination' => $value->destination,
                'business_trip_start_date' => $value->business_trip_start_date,
                'business_trip_end_date' => $value->business_trip_end_date,
                'pajak_id' => "$value->pajak_id",
                'purchasing_group_id' => "$value->purchasing_group_id",
                'reference_number' => $value->reference_number,
                'cash_advance' => $value->cash_advance,
                'total_cash_advance' => $value->total_cash_advance,
                'total_percent' => $value->total_percent,
                'detail_attedances' => $detailAttendance,
                'allowances' => $allowances,
                'allowancesResultItem' => $allowancesResultItem,
            ];
        }
        $data->destinations = $destinations;
        return $this->successResponse($data->makeHidden(['created_at', 'updated_at']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
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
                        'currency' => $row->allowance->currency_id,
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
                        'currency' => $row->allowance->currency_id,
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
                        'currency' => $rowDay->allowance->currency_id,
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
                        'currency' => $rowTotal->allowance->currency_id,
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $data = BusinessTrip::find($id);
        $data->delete();
        return $this->successResponse($data);
    }

    public function storeAPI(Request $request)
    {
        try {
            DB::beginTransaction();

            $yearMonth = now()->format('Y-m'); // Format tahun dan bulan
            $prefix = "ODR-{$yearMonth}-"; // Prefix untuk request number

            // Cari nomor urut terakhir berdasarkan prefix dan type
            $latestOrder = BusinessTrip::where('request_no', 'like', "$prefix%")
                ->where('type', 'request') // Filter berdasarkan tipe
                ->latest('id') // Urutkan berdasarkan ID terbaru
                ->first();

            // Ambil nomor urut terakhir dari kode, atau mulai dari 1 jika belum ada
            $sequence = $latestOrder
                ? (int)substr($latestOrder->request_no, strlen($prefix)) + 1
                : 1;

            // Format menjadi angka 8 digit (misalnya 00000001, 00000002, dst.)
            $sequence = str_pad($sequence, 8, '0', STR_PAD_LEFT);

            // Gabungkan prefix dan nomor urut
            $requestNo = $prefix . $sequence;

            $businessTrip = BusinessTrip::create([
                'request_no' => $requestNo,
                'purpose_type_id' => $request->purpose_type_id,
                'request_for' => $request->request_for,
                'cost_center_id' => $request->cost_center_id,
                'remarks' => $request->remark,
                'total_destination' => $request->total_destination,
                'created_by' => auth()->user()->id,
                'type' => 'request',
                'cash_advance' => $request->cash_advance == "true" ? 1 : 0,
                'reference_number' => $requestNo,
                'total_percent' => $request->cash_advance == "true" ? $request->total_percent : null,
                'total_cash_advance' => $request->cash_advance == "true" ? str_replace('.', '', $request->total_cash_advance) : null,
            ]);

            if ($request->attachment != null) {
                foreach ($request->attachment as $row) {
                    // Ambil nama asli file
                    $originalName = pathinfo($row->getClientOriginalName(), PATHINFO_FILENAME);
                    $extension = $row->getClientOriginalExtension();
                    // Tambahkan timestamp di akhir nama file
                    $timestampedName = $originalName . '_' . time() . '.' . $extension;
                    // Simpan file dengan nama yang telah dimodifikasi
                    $filePath = $row->storeAs('business_trip', $timestampedName, 'public');
                    // Simpan data ke database
                    BusinessTripAttachment::create([
                        'business_trip_id' => $businessTrip->id,
                        'file_path' => 'business_trip', // Folder tempat file disimpan
                        'file_name' => $timestampedName, // Nama file dengan timestamp
                    ]);
                }
            }

            foreach ($request->destinations as $key => $value) {
                $data_destination = json_decode($value, true);
                $businessTripDestination = BusinessTripDestination::create([
                    'business_trip_id' => $businessTrip->id,
                    'destination' => $data_destination['destination'],
                    'business_trip_start_date' => date('Y-m-d', strtotime($data_destination['business_trip_start_date'])),
                    'business_trip_end_date' => date('Y-m-d', strtotime($data_destination['business_trip_end_date'])),
                    'pajak_id' => $data_destination['pajak_id'],
                    'purchasing_group_id' => $data_destination['purchasing_group_id'],
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
            $this->approvalServices->Payment($request, true, $businessTrip->id, 'TRIP');
            DB::commit();


            // return $this->successResponse("All data has been processed successfully");
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    public function listAPI(Request $request)
    {

        $query =  BusinessTrip::query()->with(['purposeType', 'status']);
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');

        // $query->orderBy($sortBy, $sortDirection);
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)->where('document_name', 'TRIP')->pluck('document_id')->toArray();
            $query = $query->whereIn('id', $data)->where('status_id',1);
        }else{
            $query = $query->where(function($query) {
                $query->where('created_by', Auth::user()->id)
                      ->orWhere('request_for', Auth::user()->id);
            });
        }

        $query = $query->where('type','=','request');

        $query = $query->latest()->search(request(['search']))->paginate($perPage);

        $query->getCollection()->transform(function ($map) {

            $purposeRelations = $map->purposeType ? $map->purposeType->name : ''; // Assuming 'name' is the field

            return [
                'id' => $map->id,
                'status_id' => $map->status_id,
                'request_no' => $map->request_no,
                'remarks' => $map->remarks,
                'request_for' => $map->requestFor->name,
                'status' => [
                    'name' => $map->status->name,
                    'classname' => $map->status->classname,
                    'code' => $map->status->code
                ],
                'purpose_type' => $purposeRelations, // You can join multiple relations here if it's an array
                'total_destination' => $map->total_destination, // You can join multiple relations here if it's an array
                'created_at' => date('d/m/Y', strtotime($map->created_at)),
            ];
        });


        return $this->successResponse($query);
    }

    public function update(Request $request, $id)
    {
        try {
            $businessTrip = BusinessTrip::find($id);
            $businessTrip->remarks = $request->remark;
            $businessTrip->save();

            if($request->file_existing != null){
                // DELETE ATTACHMENT DULU JIKA ADA YANG DI HAPUS
                $array_id_exist = [];
                foreach ($request->file_existing as $key => $attachment) {
                    $decode = json_decode($attachment);
                    $array_id_exist[] = $decode->id;
                }
                $businessTrip->attachment()->whereNotIn('id', $array_id_exist)->delete();
            }else{
                $businessTrip->attachment()->delete();
            }

            // BARU TAMBAH ATTACHMENT
            if ($request->attachment != null) {
                foreach ($request->attachment as $row) {
                    // Ambil nama asli file
                    $originalName = pathinfo($row->getClientOriginalName(), PATHINFO_FILENAME);
                    $extension = $row->getClientOriginalExtension();
                    // Tambahkan timestamp di akhir nama file
                    $timestampedName = $originalName . '_' . time() . '.' . $extension;
                    // Simpan file dengan nama yang telah dimodifikasi
                    $filePath = $row->storeAs('business_trip', $timestampedName, 'public');
                    // Simpan data ke database
                    BusinessTripAttachment::create([
                        'business_trip_id' => $businessTrip->id,
                        'file_path' => 'business_trip', // Folder tempat file disimpan
                        'file_name' => $timestampedName, // Nama file dengan timestamp
                    ]);
                }
            }

            // return $this->successResponse("Updated successfully");
        } catch (\Throwable $th) {
            return $this->errorResponse($th->getMessage());
        }
    }

    function printAPI($id)
    {
        $findData  = BusinessTrip::find($id);
        $data = [];
        $data['request_no'] = $findData->request_no;
        $data['remarks'] = $findData->remarks;
        $data['cash_advance'] = $findData->cash_advance;
        $data['total_percent'] = $findData->total_percent;
        $data['total_cash_advance'] = number_format($findData->total_cash_advance, 0, ',', '.');
        $data['reference_number'] = $findData->reference_number;
        $data['request_for'] = $findData->requestFor->name;
        $data['requested_by'] = $findData->requestedBy->name;
        $data['purpose_type_name'] = $findData->purposeType->name;
        $data['cost_center'] = $findData->costCenter?->cost_center;
        $data['start_date'] = date('d-m-Y', strtotime($findData->detailAttendance()->orderBy('date', 'asc')->first()?->date));
        $data['end_date'] = date('d-m-Y', strtotime($findData->detailAttendance()->orderBy('date', 'desc')->first()?->date));
        $attachments = $findData->attachment->map(function ($attachment) {
            return [
                'url' => asset('storage/' . $attachment->file_path . '/' . $attachment->file_name),
                'file_name' => $attachment->file_name,
            ];
        });
        $data['file_attachement'] = $attachments;
        $data['approval'] = Approval::with('user.divisions')->where('document_id', $id)->where('document_name', 'TRIP')->orderBy('id', 'ASC')->get();

        $data['status'] = [
            'id' => $findData->status_id,
            'name' => $findData->status->name,
            'color' => $findData->status->color,
            'code' => $findData->status->code,
            'classname' => $findData->status->classname,
        ];
        // dd($data['status']);

        foreach ($findData->businessTripDestination as $destination) {
            $detail_attendance = [];
            foreach ($destination->detailAttendance as $detail) {
                $detail_attendance[] = [
                    'date' => $detail->date,
                    'start_time' => $detail->start_time,
                    'end_time' => $detail->end_time,
                    'shift_code' => $detail->shift_code,
                    'shift_start' => $detail->shift_start,
                    'shift_end' => $detail->shift_end,
                ];
            }


            // STANDARD
            $standar_detail_allowance = [];
            foreach ($destination->detailDestinationDay as $detailDay) {
                $standar_detail_allowance[] = [
                    'item_name' => $detailDay->allowance->name,
                    'type' => $detailDay->allowance->type,
                    'currency_code' => $detailDay->allowance->currency_id,
                    'value' => (int)$detailDay->standard_value,
                    'total_day' => $detailDay->total,
                    'total' => $detailDay->standard_value * $detailDay->total,
                ];
            }


            foreach ($destination->detailDestinationTotal as $detailTotal) {
                $standar_detail_allowance[] = [
                    'item_name' => $detailTotal->allowance->name,
                    'type' => $detailTotal->allowance->type,
                    'currency_code' => $detailTotal->allowance->currency_id,
                    'value' => (int)$detailTotal->standard_value,
                    'total_day' => '-',
                    'total' => (int)$detailTotal->standard_value,
                ];
            }

            // REQUEST
            $request_detail_allowance = [];
            foreach ($destination->detailDestinationDay as $detailDay) {
                $request_detail_allowance[] = [
                    'item_name' => $detailDay->allowance->name,
                    'type' => $detailDay->allowance->type,
                    'currency_code' => $detailDay->allowance->currency_id,
                    'value' => (int)$detailDay->price / $detailDay->total,
                    'total_day' => $detailDay->total,
                    'total' => $detailDay->price,
                ];
            }

            foreach ($destination->detailDestinationTotal as $detailTotal) {
                $request_detail_allowance[] = [
                    'item_name' => $detailTotal->allowance->name,
                    'type' => $detailTotal->allowance->type,
                    'currency_code' => $detailTotal->allowance->currency_id,
                    'value' => (int)$detailTotal->price,
                    'total_day' => '-',
                    'total' => (int)$detailTotal->price,
                ];
            }

            $data['business_trip_destination'][] = [
                'id' => $destination->id,
                'destination' => $destination->destination,
                'business_trip_start_date' => $destination->business_trip_start_date,
                'business_trip_end_date' => $destination->business_trip_end_date,
                'other_allowance' => $destination->other_allowance,
                'business_trip_detail_attendance' => $detail_attendance,
                'standar_detail_allowance' => $standar_detail_allowance,
                'request_detail_allowance' => $request_detail_allowance,
            ];
        }
        return view('print', compact('data'));
    }

    function detailBtRequestAPI($id)
    {
        $findData  = BusinessTrip::find($id);
        $data = [];
        $data['status_id'] = $findData->status_id;
        $data['request_no'] = $findData->request_no;
        $data['remarks'] = $findData->remarks;
        $data['cash_advance'] = $findData->cash_advance;
        $data['total_percent'] = $findData->total_percent;
        $data['total_cash_advance'] = $findData->total_cash_advance;
        $data['reference_number'] = $findData->reference_number;
        $data['request_for'] = $findData->requestFor->name;
        $data['requested_by'] = $findData->requestedBy->name;
        $data['purpose_type_name'] = $findData->purposeType->name;
        $data['cost_center'] = $findData->costCenter?->cost_center;
        $data['start_date'] = date('d-m-Y', strtotime($findData->detailAttendance()->orderBy('date', 'asc')->first()?->date));
        $data['end_date'] = date('d-m-Y', strtotime($findData->detailAttendance()->orderBy('date', 'desc')->first()?->date));
        $data['status'] = [
            'id' => $findData->status_id,
            'name' => $findData->status->name,
            'color' => $findData->status->color,
            'code' => $findData->status->code
        ];
        $attachments = $findData->attachment->map(function ($attachment) {
            return [
                'url' => asset('storage/' . $attachment->file_path . '/' . $attachment->file_name),
                'file_name' => $attachment->file_name,
            ];
        });
        $data['file_attachement'] = $attachments;

        foreach ($findData->businessTripDestination as $destination) {
            $detail_attendance = [];
            foreach ($destination->detailAttendance as $detail) {
                $detail_attendance[] = [
                    'date' => date('d-m-Y', strtotime($detail->date)),
                    'start_time' => $detail->start_time,
                    'end_time' => $detail->end_time,
                    'shift_code' => $detail->shift_code,
                    'shift_start' => $detail->shift_start,
                    'shift_end' => $detail->shift_end,
                ];
            }

            // STANDARD
            $standar_detail_allowance = [];
            $total_standard = 0;
            foreach ($destination->detailDestinationDay as $detailDay) {
                $standar_detail_allowance[] = [
                    'item_name' => $detailDay->allowance->name,
                    'type' => $detailDay->allowance->type,
                    'currency_code' => $detailDay->allowance->currency_id,
                    'value' => number_format($detailDay->standard_value,0, ',', '.'),
                    'total_day' => $detailDay->total,
                    'total' => number_format($detailDay->standard_value * $detailDay->total, 0, ',', '.'),
                ];
                $total_standard += $detailDay->standard_value * $detailDay->total;
            }


            foreach ($destination->detailDestinationTotal as $detailTotal) {
                $standar_detail_allowance[] = [
                    'item_name' => $detailTotal->allowance->name,
                    'type' => $detailTotal->allowance->type,
                    'currency_code' => $detailTotal->allowance->currency_id,
                    'value' => number_format($detailTotal->standard_value, 0, ',', '.'),
                    'total_day' => '-',
                    'total' => number_format($detailTotal->standard_value, 0, ',', '.'),
                ];
                $total_standard += $detailTotal->standard_value;
            }

            // REQUEST
            $request_detail_allowance = [];
            $total_request = 0;
            foreach ($destination->detailDestinationDay as $detailDay) {
                $request_detail_allowance[] = [
                    'item_name' => $detailDay->allowance->name,
                    'type' => $detailDay->allowance->type,
                    'currency_code' => $detailDay->allowance->currency_id,
                    'value' => number_format($detailDay->price / $detailDay->total, 0, ',', '.'),
                    'total_day' => $detailDay->total,
                    'total' => number_format($detailDay->price, 0, ',', '.'),
                ];
                $total_request += $detailDay->price;
            }

            foreach ($destination->detailDestinationTotal as $detailTotal) {
                $request_detail_allowance[] = [
                    'item_name' => $detailTotal->allowance->name,
                    'type' => $detailTotal->allowance->type,
                    'currency_code' => $detailTotal->allowance->currency_id,
                    'value' => number_format($detailTotal->price, 0, ',', '.'),
                    'total_day' => '-',
                    'total' => number_format($detailTotal->price, 0, ',', '.'),
                ];
                $total_request += $detailTotal->price;
            }

            $data['business_trip_destination'][] = [
                'destination' => $destination->destination,
                'business_trip_start_date' => $destination->business_trip_start_date,
                'business_trip_end_date' => $destination->business_trip_end_date,
                'other_allowance' => $destination->other_allowance,
                'business_trip_detail_attendance' => $detail_attendance,
                'standar_detail_allowance' => $standar_detail_allowance,
                'request_detail_allowance' => $request_detail_allowance,
                'total_standard' => number_format($total_standard, 0, ',', '.'),
                'total_request' => number_format($total_request, 0, ',', '.'),
                'cash_advance' => $destination->cash_advance,
                'total_percent' => $destination->total_percent . '%',
                'total_cash_advance' => number_format($destination->total_cash_advance, 0, ',', '.'),
            ];
        }
        return $this->successResponse($data);
    }
}
