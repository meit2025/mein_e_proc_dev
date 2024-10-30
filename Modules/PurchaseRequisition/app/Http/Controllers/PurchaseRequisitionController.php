<?php

namespace Modules\PurchaseRequisition\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Modules\Master\Models\MasterBusinessPartner;
use Modules\Master\Models\Pajak;
use Modules\PurchaseRequisition\Models\CashAdvance;
use Modules\PurchaseRequisition\Models\CashAdvancePurchases;
use Modules\PurchaseRequisition\Models\Entertainment;
use Modules\PurchaseRequisition\Models\Purchase;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;
use Modules\PurchaseRequisition\Models\Unit;
use Modules\PurchaseRequisition\Models\Vendor;
use Modules\PurchaseRequisition\Services\BtPOService;
use Modules\PurchaseRequisition\Services\BtService;
use Modules\PurchaseRequisition\Services\ProcurementService;

class PurchaseRequisitionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $procurementService;
    protected $bt;
    protected $btPO;

    public function __construct(ProcurementService $procurementService, BtService $bt, BtPOService $btPO)
    {
        $this->procurementService = $procurementService;
        $this->bt = $bt;
        $this->btPO = $btPO;
    }

    public function generateText($id, $type)
    {
        try {
            switch ($type) {
                case 'pr':
                    # code...
                    $data = $this->procurementService->processTextData($id);
                    return response()->json(['message' => 'Data processed successfully', 'data' => $data]);
                    break;
                case 'bt';
                    $data = $this->bt->processTextData($id, 'BTRE');
                    return response()->json(['message' => 'Data processed successfully', 'data' => $data]);
                    break;
                case 'bt-po';
                    $data = $this->btPO->processTextData($id);
                    return response()->json(['message' => 'Data processed successfully', 'data' => $data]);
                    break;

                default:
                    # code...
                    break;
            }
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function index(Request $request) {}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('purchaserequisition::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {


        // mapping unitnya


    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('purchaserequisition::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('purchaserequisition::edit');
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

    //
    public function textData($id)
    {
        DB::beginTransaction();
        try {
            //code...
            $procurement = Purchase::find($id);
            if (!$procurement) {
                return $this->errorResponse('pr not found');
            }
            $vendor = Vendor::where('purchase_id', $procurement->id)->where('winner', true)->first();
            if (!$vendor) {
                return $this->errorResponse('vendor winner not found');
            }
            $item = Unit::where('vendor_id', $vendor->id)->get();
            if (count($item) == 0) {
                return $this->errorResponse('item not found');
            }

            $user = User::where('id', $procurement->user_id)->first();

            $businessPartner = '';
            if ($user && $user->master_business_partner_id) {
                $businessPartner = MasterBusinessPartner::find($user->master_business_partner_id);
                if (!$businessPartner) {
                    return $this->errorResponse('business partner not found');
                }
            }

            $array = [];
            $arrayCash = [];

            $latestRequisition = PurchaseRequisition::orderBy('purchase_requisition_number', 'desc')->first();
            $entertainment = Entertainment::where('purchase_id', $vendor->id)->first();
            $cashData = CashAdvancePurchases::where('purchase_id', $vendor->id)->first();

            $reqno = $latestRequisition ? (int)$latestRequisition->purchase_requisition_number : 0;

            foreach ($item as $key => $value) {
                $reqno = $reqno + 1;
                $vendor = MasterBusinessPartner::find($value->vendor_id);
                $date = Carbon::parse($procurement->created_at);
                $formattedDate = $date->format('Y-m-d');

                $dateStr = Carbon::parse($procurement->delivery_date);
                $formattedDatestr = $dateStr->format('Y-m-d');

                $tax = Pajak::where('mwszkz',  $value->tax)->first();

                # code...
                $datainsert = [
                    'purchase_id' => $id,
                    'code_transaction' => 'ven', // code_transaction
                    'purchase_requisition_number' => $reqno, //banfn
                    'item_number' => $value->material_number, // bnfpo
                    'requisitioner_name' => $businessPartner->partner_number, // afnam
                    'requisition_date' => $formattedDate, // badat
                    'requirement_tracking_number' => '', // bednr
                    'document_type' => $procurement->document_type, //bsart
                    'valuation_type' => '', //bwtar
                    'is_closed' => '', // ebakz
                    'purchasing_group' => $procurement->purchasing_groups, // ekgrp
                    'purchasing_organization' => '1600',  // ekorg
                    'account_assignment_category' => $procurement->account_assignment_categories, // knttp
                    'item_delivery_date' => $formattedDatestr, // lfdat
                    'storage_location' => $procurement->storage_locations, // lgort
                    'desired_vendor' => $vendor->partner_number, // lifnr
                    'material_group' => $value->material_group, // matkl
                    'material_number' => $value->material_number, // matnr
                    'unit_of_measure' => $value->uom, // meins
                    'quantity' => $value->qty, // menge
                    'netpr' => '',
                    'waers' => '',
                    'tax_code' => $value->tax, // mwskz
                    'item_category' => '', // pstyp
                    'short_text' => $value->short_text, // txz01
                    'plant' => 'ID01', // werks
                    'cost_center' => $value->cost_center, // kostl
                    'order_number' => $value->order_number, // AUFNR
                    'asset_subnumber' => $value->sub_asset_number, // anln2
                    'main_asset_number' => $value->asset_number, // anln1
                    'tanggal_entertainment' => $entertainment->tanggal, // b81
                    'tempat_entertainment' => $entertainment->tempat, // b83
                    'alamat_entertainment' => $entertainment->alamat,
                    'jenis_entertainment' => $entertainment->jenis,
                    'nama_entertainment' => $entertainment->nama,
                    'posisi_entertainment' => $entertainment->posisi,
                    'jenis_usaha_entertainment' => $entertainment->jenis_usaha,
                    'jenis_kegiatan_entertainment' => $entertainment->jenis_kegiatan, // b89
                    'header_not' => $entertainment->header_not, // b01
                    'B01' => $value->short_text,
                    'B03' => $value->short_text,
                    'B04' => $value->short_text,
                    'Attachment_link' => '',
                ];
                $create = PurchaseRequisition::create($datainsert);
                unset($datainsert['purchase_id']);
                $array[] = $datainsert;

                if ($procurement->is_cashAdvance) {
                    $datainsertcashAdvance = [
                        'purchase_id' => $id,
                        'code_transaction' => 'dp', // code_transaction
                        'belnr' => '', // belnr
                        'company_code' => '1600', // bukrs
                        'gjahr' => '', // gjahr
                        'currency' => 'IDR', // waers
                        'document_date' => $cashData->document_date, // bldat
                        'budat' => '', // budat
                        'monat' => '', // monat
                        'reference' => $cashData->reference, // xblnr
                        'document_header_text' => $cashData->document_header_text, // bktxt
                        'vendor_code' => $vendor->partner_number, // lifnr
                        'amount' => $value->total_amount, // lifnr
                        'saknr' => '', //saknr
                        'hkont' => '', //hkont
                        'amount_local_currency' => $value->total_amount, //dmbtr
                        'tax_code' => $value->tax,
                        'dzfbdt' => '', //dzfbdt
                        'purchasing_document' => '', //ebeln
                        'purchasing_document_item' => '1', //ebelp
                        'assigment' => $reqno, //dzuonr
                        'text' => 'DP ' .  $value->tax . ' ' . $cashData->text, // sgtxt
                        'profit_center' => $value->cost_center, // prctr
                        'tax_amount' => $value->total_amount - ((int)$value->total_amount * ((int)$tax->desimal / 100)), // wmwst
                    ];
                    CashAdvance::create($datainsertcashAdvance);
                    $arrayCash[] = $datainsertcashAdvance;
                }
            }
            $timestamp = date('Ymd_His');
            $filename = 'INB_PRCRT_' . 1 . '_' . $timestamp . '.txt';

            if (count($arrayCash) != 0) {
                $filenameAc = 'INB_PRDP_' . 1 . '_' . $timestamp . '.txt';
                $fileContentAC = '';

                foreach ($arrayCash as $aC) {
                    $fileContentAC .= implode("|", $aC) . PHP_EOL;
                }
                Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($filenameAc, $fileContentAC);
            }



            $fileContent = '';

            foreach ($array as $item) {
                $fileContent .= implode("|", $item) . PHP_EOL;
            }
            Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($filename, $fileContent);
            DB::commit();
            return $this->successResponse($array);
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return $this->errorResponse($th->getMessage());
        }
    }

    public function Reimburse($id)
    {
        DB::beginTransaction();
        try {
            //code...
            $procurement = Purchase::find($id);
            if (!$procurement) {
                return $this->errorResponse('pr not found');
            }
            $vendor = Vendor::where('purchase_id', $procurement->id)->where('winner', true)->first();
            if (!$vendor) {
                return $this->errorResponse('vendor winner not found');
            }
            $item = Unit::where('vendor_id', $vendor->id)->get();
            if (count($item) == 0) {
                return $this->errorResponse('item not found');
            }

            $user = User::where('id', $procurement->user_id)->first();

            $businessPartner = '';
            if ($user && $user->master_business_partner_id) {
                $businessPartner = MasterBusinessPartner::find($user->master_business_partner_id);
                if (!$businessPartner) {
                    return $this->errorResponse('business partner not found');
                }
            }

            $array = [];
            $arrayCash = [];

            $latestRequisition = PurchaseRequisition::orderBy('purchase_requisition_number', 'desc')->first();
            $entertainment = Entertainment::where('purchase_id', $vendor->id)->first();
            $cashData = CashAdvancePurchases::where('purchase_id', $vendor->id)->first();

            $reqno = $latestRequisition ? (int)$latestRequisition->purchase_requisition_number : 0;

            foreach ($item as $key => $value) {
                $reqno = $reqno + 1;
                $vendor = MasterBusinessPartner::find($value->vendor_id);
                $date = Carbon::parse($procurement->created_at);
                $formattedDate = $date->format('Y-m-d');

                $dateStr = Carbon::parse($procurement->created_at);
                $formattedDatestr = $dateStr->format('Y-m-d');

                $tax = Pajak::where('mwszkz',  $value->tax)->first();

                # code...
                $datainsert = [
                    'purchase_id' => $id,
                    'code_transaction' => 'ven', // code_transaction
                    'purchase_requisition_number' => $reqno, //banfn
                    'item_number' => $value->material_number, // bnfpo
                    'requisitioner_name' => $businessPartner->partner_number, // afnam
                    'requisition_date' => $formattedDate, // badat
                    'requirement_tracking_number' => '', // bednr
                    'document_type' => $procurement->document_type, //bsart
                    'valuation_type' => '', //bwtar
                    'is_closed' => '', // ebakz
                    'purchasing_group' => $procurement->purchasing_groups, // ekgrp
                    'purchasing_organization' => '1600',  // ekorg
                    'account_assignment_category' => $procurement->account_assignment_categories, // knttp
                    'item_delivery_date' => $formattedDatestr, // lfdat
                    'storage_location' => $procurement->storage_locations, // lgort
                    'desired_vendor' => $vendor->partner_number, // lifnr
                    'material_group' => $value->material_group, // matkl
                    'material_number' => $value->material_number, // matnr
                    'unit_of_measure' => $value->uom, // meins
                    'quantity' => $value->qty, // menge
                    'netpr' => '',
                    'waers' => '',
                    'tax_code' => $value->tax, // mwskz
                    'item_category' => '', // pstyp
                    'short_text' => $value->short_text, // txz01
                    'plant' => 'ID01', // werks
                    'cost_center' => $value->cost_center, // kostl
                    'order_number' => $value->order_number, // AUFNR
                    'asset_subnumber' => $value->sub_asset_number, // anln2
                    'main_asset_number' => $value->asset_number, // anln1
                    'tanggal_entertainment' => $entertainment->tanggal, // b81
                    'tempat_entertainment' => $entertainment->tempat, // b83
                    'alamat_entertainment' => $entertainment->alamat,
                    'jenis_entertainment' => $entertainment->jenis,
                    'nama_entertainment' => $entertainment->nama,
                    'posisi_entertainment' => $entertainment->posisi,
                    'jenis_usaha_entertainment' => $entertainment->jenis_usaha,
                    'jenis_kegiatan_entertainment' => $entertainment->jenis_kegiatan, // b89
                    'header_not' => $entertainment->header_not, // b01
                    'B01' => $value->short_text,
                    'B03' => $value->short_text,
                    'B04' => $value->short_text,
                    'Attachment_link' => '',
                ];
                $create = PurchaseRequisition::create($datainsert);
                unset($datainsert['purchase_id']);
                $array[] = $datainsert;

                if ($procurement->is_cashAdvance) {
                    $datainsertcashAdvance = [
                        'purchase_id' => $id,
                        'code_transaction' => 'dp', // code_transaction
                        'belnr' => '', // belnr
                        'company_code' => '1600', // bukrs
                        'gjahr' => '', // gjahr
                        'currency' => 'IDR', // waers
                        'document_date' => $cashData->document_date, // bldat
                        'budat' => '', // budat
                        'monat' => '', // monat
                        'reference' => $cashData->reference, // xblnr
                        'document_header_text' => $cashData->document_header_text, // bktxt
                        'vendor_code' => $vendor->partner_number, // lifnr
                        'amount' => $value->total_amount, // lifnr
                        'saknr' => '', //saknr
                        'hkont' => '', //hkont
                        'amount_local_currency' => $value->total_amount, //dmbtr
                        'tax_code' => $value->tax,
                        'dzfbdt' => '', //dzfbdt
                        'purchasing_document' => '', //ebeln
                        'purchasing_document_item' => '1', //ebelp
                        'assigment' => $reqno, //dzuonr
                        'text' => 'DP ' .  $value->tax . ' ' . $cashData->text, // sgtxt
                        'profit_center' => $value->cost_center, // prctr
                        'tax_amount' => $value->total_amount - ((int)$value->total_amount * ((int)$tax->desimal / 100)), // wmwst
                    ];
                    CashAdvance::create($datainsertcashAdvance);
                    $arrayCash[] = $datainsertcashAdvance;
                }
            }
            $timestamp = date('Ymd_His');
            $filename = 'INB_PRCRT_' . 1 . '_' . $timestamp . '.txt';

            if (count($arrayCash) != 0) {
                $filenameAc = 'INB_PRDP_' . 1 . '_' . $timestamp . '.txt';
                $fileContentAC = '';

                foreach ($arrayCash as $aC) {
                    $fileContentAC .= implode("|", $aC) . PHP_EOL;
                }
                Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($filenameAc, $fileContentAC);
            }



            $fileContent = '';

            foreach ($array as $item) {
                $fileContent .= implode("|", $item) . PHP_EOL;
            }
            Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($filename, $fileContent);
            DB::commit();
            return $this->successResponse($array);
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return $this->errorResponse($th->getMessage());
        }
    }
}
