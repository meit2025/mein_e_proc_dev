<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\SapJobs;
use App\Models\User;
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
use Modules\BusinessTrip\Models\PurposeType;
use Modules\BusinessTrip\Models\PurposeTypeAllowance;
use Modules\Approval\Services\CheckApproval;

class BusinessTripDeclarationController extends Controller
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
        $inBusinessTripRequest = BusinessTrip::where('type', 'declaration')->pluck('parent_id')->toArray();
        $listBusinessTrip = BusinessTrip::where('type', 'request')->whereNotIn('id', $inBusinessTripRequest)->get();
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
        $data = BusinessTrip::with(['costCenter'])->where('id', $id)->first();
        $data->name_request = $data->requestFor->name;
        $data->name_purpose = $data->purposeType->name;
        $data->cash_advance = $data->cash_advance;
        $data->total_percent = $data->total_percent;
        $data->total_cash_advance = $data->total_cash_advance;
        $data->reference_number = $data->reference_number;
        $attachments = $data->attachment->map(function ($attachment) {
            return [
                'url' => asset('storage/' . $attachment->file_path . '/' . $attachment->file_name),
                'file_name' => $attachment->file_name,
            ];
        });
        $data->file_attachement = $attachments;
        $destinations = [];
        foreach ($data->businessTripDestination as $key => $value) {
            // Inisialisasi array allowances dengan kunci allowance_id
            $allowances = [];
            $total_allowance = 0;
            // Mengisi data allowance dari detailDestinationDay
            foreach ($value->getDetailDestinationDay as $row) {
                $allowanceId = $row->allowance->id;
                if (!isset($allowances[$allowanceId])) {
                    $allowances[$allowanceId] = [
                        'name' => $row->allowance->name,
                        'code' => $row->allowance->code,
                        'default_price' => number_format($row->standard_value, 0, '.', ''),
                        'type' => $row->allowance->type,
                        'subtotal' => 0,
                        'currency' => $row->allowance->currency_id,
                        'request_value' => $row->allowance->request_value,
                        'detail' => [] // Array untuk menampung detail
                    ];
                }

                // Tambahkan detail allowance
                $allowances[$allowanceId]['detail'][] = [
                    'date' => $row->date, // Sesuaikan dengan nama kolom tanggal di detailDestinationDay
                    'request_price' => (int)$row->price // Sesuaikan dengan kolom request_price di detailDestinationDay
                ];

                $allowances[$allowanceId]['subtotal'] += $row->price;
                $total_allowance += $row->price;
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
                        'subtotal' => 0,
                        'currency' => $row->allowance->currency_id,
                        'request_value' => $row->allowance->request_value,
                        'detail' => []
                    ];
                }

                // Tambahkan detail allowance
                $allowances[$allowanceId]['detail'][] = [
                    'date' => '', // Sesuaikan dengan nama kolom tanggal di detailDestinationTotal
                    'request_price' => (int)$row->price // Sesuaikan dengan kolom request_price di detailDestinationTotal
                ];

                $allowances[$allowanceId]['subtotal'] += $row->price;
                $total_allowance += $row->price;
            }

            $allowances = array_values($allowances);

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
                'other_allowance' => $value->other_allowance,
                'pajak' => $value->pajak->mwszkz ?? '',
                'purchasing_group' => $value->purchasingGroup->purchasing_group ?? '',
                'business_trip_start_date' => $value->business_trip_start_date,
                'business_trip_end_date' => $value->business_trip_end_date,
                'detail_attedances' => $detailAttendance,
                'allowances' => $allowances,
                'total_allowance' => $total_allowance,
                // 'allowancesResultItem' => $allowancesResultItem,
            ];
        }

        $data->destinations = $destinations;
        return $this->successResponse($data->makeHidden(['created_at', 'updated_at']));
    }


    public function detailBtDeclareAPI($id)
    {
        $findData  = BusinessTrip::find($id);
        $data = [];
        $data['request_no'] = $findData->request_no;
        $data['remarks'] = $findData->remarks;
        $data['request_for'] = $findData->requestFor->name;
        $data['requested_by'] = $findData->requestedBy->name;
        $data['cash_advance'] = $findData->cash_advance;
        $data['total_percent'] = $findData->total_percent;
        $data['total_cash_advance'] = $findData->total_cash_advance;
        $data['reference_number'] = $findData->reference_number;
        $data['parent_business_trip_request_no'] = $findData->parentBusinessTrip->request_no;
        $data['purpose_type_name'] = $findData->purposeType->name;
        $data['cost_center'] = $findData->costCenter?->cost_center;
        $data['created_at'] = date('d-m-Y', strtotime($findData->created_at));
        $attachments = $findData->attachment->map(function ($attachment) {
            return [
                'url' => asset('storage/' . $attachment->file_path . '/' . $attachment->file_name),
                'file_name' => $attachment->file_name,
            ];
        });
        $data['file_attachement'] = $attachments;
        $data['status'] = [
            'id' => $findData->status_id,
            'name' => $findData->status->name,
            'color' => $findData->status->color,
            'code' => $findData->status->code
        ];

        $parentDestination = [];
        $request_detail_allowance_from_parent = [];
        foreach ($findData->parentBusinessTrip->businessTripDestination as $parent) {
            $request_detail_allowance = [];
            foreach ($parent->detailDestinationDay as $detailDay) {
                $request_detail_allowance[] = [
                    'item_name' => $detailDay->allowance->name,
                    'type' => $detailDay->allowance->type,
                    'currency_code' => $detailDay->allowance->currency_id,
                    'value' => (int)$detailDay->price / $detailDay->total,
                    'total_day' => $detailDay->total,
                    'total' => $detailDay->price * $detailDay->total,
                ];
            }


            foreach ($parent->detailDestinationTotal as $detailTotal) {
                $request_detail_allowance[] = [
                    'item_name' => $detailTotal->allowance->name,
                    'type' => $detailTotal->allowance->type,
                    'currency_code' => $detailTotal->allowance->currency_id,
                    'value' => (int)$detailTotal->price,
                    'total_day' => '-',
                    'total' => (int)$detailTotal->price,
                ];
            }

            // $parentDestination['request_detail_allowance'][] = $request_detail_allowance;
            $parentRequestAllowanceByDestination[$parent->destination] = $request_detail_allowance;
        }


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
            $total_standard = 0;
            foreach ($destination->detailDestinationDay as $detailDay) {
                $standar_detail_allowance[] = [
                    'item_name' => $detailDay->allowance->name,
                    'type' => $detailDay->allowance->type,
                    'currency_code' => $detailDay->allowance->currency_id,
                    'value' => (int)$detailDay->standard_value,
                    'total_day' => $detailDay->total,
                    'total' => $detailDay->standard_value * $detailDay->total,
                ];
                $total_standard += $detailDay->standard_value * $detailDay->total;
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
                $total_standard += $detailTotal->standard_value;
            }

            // DECLARATION
            $declaration_detail_allowance = [];
            $total_declaration = 0;
            foreach ($destination->detailDestinationDay as $detailDay) {
                $declaration_detail_allowance[] = [
                    'item_name' => $detailDay->allowance->name,
                    'type' => $detailDay->allowance->type,
                    'currency_code' => $detailDay->allowance->currency_id,
                    'value' => (int)$detailDay->price / $detailDay->total,
                    'total_day' => $detailDay->total,
                    'total' => $detailDay->price * $detailDay->total,
                ];
                $total_declaration += $detailDay->price * $detailDay->total;
            }


            foreach ($destination->detailDestinationTotal as $detailTotal) {
                $declaration_detail_allowance[] = [
                    'item_name' => $detailTotal->allowance->name,
                    'type' => $detailTotal->allowance->type,
                    'currency_code' => $detailTotal->allowance->currency_id,
                    'value' => (int)$detailTotal->price,
                    'total_day' => '-',
                    'total' => (int)$detailTotal->price,
                ];
                $total_declaration += $detailTotal->price;
            }

            $request_detail_allowance = $parentRequestAllowanceByDestination[$destination->destination] ?? [];
            $total_request = 0;
            foreach ($request_detail_allowance as $detail) {
                $total_request += $detail['total'];
            }

            $data['business_trip_destination'][] = [
                'destination' => $destination->destination,
                'restricted_area' => $destination->restricted_area,
                'business_trip_start_date' => $destination->business_trip_start_date,
                'business_trip_end_date' => $destination->business_trip_end_date,
                // 'other_allowance' => $destination->other_allowance,
                'business_trip_detail_attendance' => $detail_attendance,
                'standar_detail_allowance' => $standar_detail_allowance,
                'request_detail_allowance' => $request_detail_allowance,
                'declaration_detail_allowance' => $declaration_detail_allowance,
                'other_allowance' => number_format($destination->other_allowance, 0, '', ''),
                'total_standard' => $total_standard,
                'total_request' => $total_request,
                'total_declaration' => $total_declaration + $destination->other_allowance,
                'total_deviation' => $total_request - ($total_declaration + $destination->other_allowance)
            ];
        }
        return $this->successResponse($data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $data = BusinessTrip::with(['costCenter', 'pajak', 'purchasingGroup'])->where('id', $id)->first();
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
            $destinations[] = [
                'is_other' => $value->other_allowance == 0 ? false : true,
                'other' => $value->other_allowance,
            ];
        }
        $data->destinations = $destinations;
        return $this->successResponse($data->makeHidden(['created_at', 'updated_at']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $businessTrip = BusinessTrip::find($id);
            $businessTrip->remarks = $request->remark;
            $businessTrip->save();

            if ($request->file_existing != null) {
                // DELETE ATTACHMENT DULU JIKA ADA YANG DI HAPUS
                $array_id_exist = [];
                foreach ($request->file_existing as $key => $attachment) {
                    $decode = json_decode($attachment);
                    $array_id_exist[] = $decode->id;
                }
                $businessTrip->attachment()->whereNotIn('id', $array_id_exist)->delete();
            } else {
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $data = BusinessTrip::find($id);
        $data->delete();
        return $this->successResponse($data);
    }

    public function listAPI(Request $request)
    {

        $query =  BusinessTrip::query()->with(['purposeType', 'status']);
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        // $query->orderBy($sortBy, $sortDirection);
        if ($request->approval == "1") {
            $data = Approval::where('user_id', Auth::user()->id)
                ->where('document_name', 'TRIP_DECLARATION')->get();
            $arr = $data->filter(function ($value) {
                $previousApproval = Approval::where('id', '<', $value->id)
                    ->where('document_id', $value->document_id)
                    ->orderBy('id', 'asc')
                    ->first();

                if (is_null($previousApproval)) {
                    return !$value->is_status;
                }

                return Approval::where('id', $previousApproval->id)
                    ->where('is_status', true)
                    ->exists();
            })->pluck('document_id');
            $query = $query->whereIn('id', $arr)->where('status_id', 1);
        } else {
            $query = $query->where(function ($query) {
                $query->where('created_by', Auth::user()->id)
                    ->orWhere('request_for', Auth::user()->id);
            });
        }

        $data = $query->where('type', 'declaration')->search(request(['search']))->latest()->paginate($perPage);

        $data->getCollection()->transform(function ($map) {

            // $purposeRelations = $map->purposeType ? $map->purposeType->name : '';
            $requestFor = $map->requestFor ? $map->requestFor->name : '';
            $requestNo = $map->parentBusinessTrip ? $map->parentBusinessTrip->request_no : '';

            return [
                'id' => $map->id,
                'declaration_no' => $map->request_no,
                'request_no' => $requestNo,
                'request_for' => $requestFor,
                'remarks' => $map->remarks,
                'status_id' => $map->status_id,
                'status' => [
                    'name' => $map->status?->name,
                    'classname' => $map->status?->classname,
                    'code' => $map->status?->code
                ],
                'created_at' => date('d/m/Y', strtotime($map->created_at)),
                // 'purpose_type' => $purposeRelations, // You can join multiple relations here if it's an array
                // 'total_destination' => $map->total_destination, // You can join multiple relations here if it's an array
            ];
        });


        return $this->successResponse($data);
    }


    public function storeAPI(Request $request)
    {
        try {
            DB::beginTransaction();
            $dataBusiness = BusinessTrip::find($request->request_no);

            $yearMonth = now()->format('Y-m'); // Format tahun dan bulan
            $prefix = "DCLR-{$yearMonth}-"; // Prefix untuk request number

            // Cari nomor urut terakhir berdasarkan prefix dan type
            $latestOrder = BusinessTrip::where('request_no', 'like', "$prefix%")
                ->where('type', 'declaration') // Filter berdasarkan tipe
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
                'parent_id' => $request->request_no,
                'purpose_type_id' => $dataBusiness->purpose_type_id,
                'request_for' => $dataBusiness->request_for,
                'remarks' => $request->remark,
                'total_destination' => $dataBusiness->total_destination,
                'created_by' => auth()->user()->id,
                'type' => 'declaration',
                'cost_center_id' => $dataBusiness->cost_center_id,
                'pajak_id' => $dataBusiness->pajak_id,
                'purchasing_group_id' => $dataBusiness->purchasing_group_id,
                'cash_advance' => $dataBusiness->cash_advance,
                'total_percent' => $dataBusiness->total_percent,
                'total_cash_advance' => $dataBusiness->total_cash_advance,
            ]);

            // if ($request->attachment != null) {
            //     BusinessTripAttachment::create([
            //         'business_trip_id' => $businessTrip->id,
            //         'file_path' => explode('/', $request->attachment->store('business_trip', 'public'))[0],
            //         'file_name' => explode('/', $request->attachment->store('business_trip', 'public'))[1],
            //     ]);
            // }
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
                $other = 0;
                if (count($data_destination['other']) > 0) {
                    $other = $data_destination['other'][0]['value'];
                }

                $businessTripDestination = BusinessTripDestination::create([
                    'business_trip_id' => $businessTrip->id,
                    'destination' => $data_destination['destination'],
                    'business_trip_start_date' => date('Y-m-d', strtotime($data_destination['business_trip_start_date'])),
                    'business_trip_end_date' => date('Y-m-d', strtotime($data_destination['business_trip_end_date'])),
                    'other_allowance' => $other,
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
                                'allowance_item_id' => AllowanceItem::where('code', $allowance['code'])->withTrashed()->first()?->id,
                                'standard_value' => $allowance['default_price'],
                            ]);
                        }
                    } else {
                        foreach ($allowance['detail'] as $detail) {
                            BusinessTripDetailDestinationDayTotal::create([
                                'business_trip_destination_id' => $businessTripDestination->id,
                                'date' => $detail['date'],
                                'business_trip_id' => $businessTrip->id,
                                'price' => $detail['request_price'],
                                'allowance_item_id' => AllowanceItem::where('code', $allowance['code'])->withTrashed()->first()?->id,
                                'standard_value' => $allowance['default_price'],
                            ]);
                        }
                    }
                }
            }

            $this->approvalServices->Payment($request, true, $businessTrip->id, 'TRIP_DECLARATION');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
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
        $data['total_cash_advance'] = $findData->total_cash_advance;
        $data['reference_number'] = $findData->reference_number;
        $data['request_for'] = $findData->requestFor->name;
        $data['requested_by'] = $findData->requestedBy->name;
        $data['parent_business_trip_request_no'] = $findData->parentBusinessTrip->request_no;
        $data['purpose_type_name'] = $findData->purposeType->name;
        $data['cost_center'] = $findData->costCenter?->cost_center;
        $data['created_at'] = date('d-m-Y', strtotime($findData->created_at));
        $attachments = $findData->attachment->map(function ($attachment) {
            return [
                'url' => asset('storage/' . $attachment->file_path . '/' . $attachment->file_name),
                'file_name' => $attachment->file_name,
            ];
        });
        $data['file_attachement'] = $attachments;
        $data['status'] = [
            'id' => $findData->status_id,
            'name' => $findData->status->name,
            'color' => $findData->status->color,
            'code' => $findData->status->code,
            'classname' => $findData->status->classname,
        ];
        $data['approval'] = Approval::with('user.divisions')->where('document_id', $id)->where('document_name', 'TRIP_DECLARATION')->orderBy('id', 'ASC')->get();
        $parentDestination = [];
        $request_detail_allowance_from_parent = [];
        foreach ($findData->parentBusinessTrip->businessTripDestination as $parent) {
            $request_detail_allowance = [];
            // dd($parent->detailDestinationDay);
            foreach ($parent->detailDestinationDay as $detailDay) {
                $request_detail_allowance[] = [
                    'item_name' => $detailDay->allowance->name,
                    'type' => $detailDay->allowance->type,
                    'currency_code' => $detailDay->allowance->currency_id,
                    'value' => (int)$detailDay->price / $detailDay->total,
                    'total_day' => $detailDay->total,
                    'total' => $detailDay->price * $detailDay->total,
                ];
            }


            foreach ($parent->detailDestinationTotal as $detailTotal) {
                $request_detail_allowance[] = [
                    'item_name' => $detailTotal->allowance->name,
                    'type' => $detailTotal->allowance->type,
                    'currency_code' => $detailTotal->allowance->currency_id,
                    'value' => (int)$detailTotal->price,
                    'total_day' => '-',
                    'total' => (int)$detailTotal->price,
                ];
            }

            // $parentDestination['request_detail_allowance'][] = $request_detail_allowance;
            $parentRequestAllowanceByDestination[$parent->destination] = $request_detail_allowance;
        }

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
                    'value' => (int)$detailDay->standar_value,
                    'total_day' => $detailDay->total,
                    'total' => $detailDay->standard_value * $detailDay->total,
                ];
            }


            foreach ($destination->detailDestinationTotal as $detailTotal) {
                $standar_detail_allowance[] = [
                    'item_name' => $detailTotal->allowance->name,
                    'type' => $detailTotal->allowance->type,
                    'currency_code' => $detailTotal->allowance->currency_id,
                    'value' => (int)$detailTotal->standar_value,
                    'total_day' => '-',
                    'total' => (int)$detailTotal->standard_value,
                ];
            }

            // DECLARATION
            $declaration_detail_allowance = [];
            foreach ($destination->detailDestinationDay as $detailDay) {
                $declaration_detail_allowance[] = [
                    'item_name' => $detailDay->allowance->name,
                    'type' => $detailDay->allowance->type,
                    'currency_code' => $detailDay->allowance->currency_id,
                    'value' => (int)$detailDay->price / $detailDay->total,
                    'total_day' => $detailDay->total,
                    'total' => $detailDay->price * $detailDay->total,
                ];
            }


            foreach ($destination->detailDestinationTotal as $detailTotal) {
                $declaration_detail_allowance[] = [
                    'item_name' => $detailTotal->allowance->name,
                    'type' => $detailTotal->allowance->type,
                    'currency_code' => $detailTotal->allowance->currency_id,
                    'value' => (int)$detailTotal->price,
                    'total_day' => '-',
                    'total' => (int)$detailTotal->price,
                ];
            }

            $request_detail_allowance = $parentRequestAllowanceByDestination[$destination->destination] ?? [];

            $data['business_trip_destination'][] = [
                'destination' => $destination->destination,
                'restricted_area' => $destination->restricted_area,
                'business_trip_start_date' => $destination->business_trip_start_date,
                'business_trip_end_date' => $destination->business_trip_end_date,
                // 'other_allowance' => $destination->other_allowance,
                'business_trip_detail_attendance' => $detail_attendance,
                'standar_detail_allowance' => $standar_detail_allowance,
                'request_detail_allowance' => $request_detail_allowance,
                'declaration_detail_allowance' => $declaration_detail_allowance,
                'other_allowance' => $destination->other_allowance
            ];
        }
        return view('print-bt-declaration', compact('data'));
    }
}
