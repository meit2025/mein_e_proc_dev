<?php

namespace Modules\PurchaseRequisition\Services;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Modules\BusinessTrip\Models\AllowanceItem;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\BusinessTrip\Models\BusinessTripAttachment;
use Modules\BusinessTrip\Models\BusinessTripDestination;
use Modules\BusinessTrip\Models\BusinessTripDetailAttedance;
use Modules\Master\Models\Pajak;
use Modules\PurchaseRequisition\Models\CashAdvance;
use Modules\PurchaseRequisition\Models\PurchaseOrder;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;

class BtPOService
{

    //                       TYPE char4,
    //                       TYPE char12,
    //                       TYPE char10,
    //                       TYPE char10,
    //                       TYPE char5,
    //                       TYPE char5,
    //                       TYPE char1,
    //                       TYPE char1,
    //                       TYPE char1,
    //                       TYPE char4,
    //                       TYPE char9,
    //                       TYPE char40,
    //                       TYPE char3,
    //                       TYPE char20,
    //                       TYPE char2,
    //                       TYPE char20,
    //                       TYPE char1,
    //                       TYPE char1,
    //                       TYPE text40,
    //                       TYPE char1,
    //                       TYPE char1,
    //                       TYPE char4,
    //                       TYPE char12,
    //                       TYPE char4,
    //                       TYPE char12,
    //                       TYPE char10,
    //           F81              TYPE string,
    //           F82              TYPE string,
    //           F83              TYPE string,
    //           F84              TYPE string,
    //           F85              TYPE string,
    //           F86              TYPE string,
    //           F87              TYPE string,
    //           F88              TYPE string,
    //           F89              TYPE string,
    //           F02              Type String
    //           F01              TYPE string
    //           F03              TYPE string
    //           F04              TYPE string
    //           Attachment_link Type String
    public function processTextData($id)
    {
        DB::beginTransaction();
        try {

            $BusinessTrip = $this->findBusinessTripPr($id);
            $attachment = $this->findBusinessAttachment($id);



            $array = [];
            $arrayCash = [];
            $latestRequisition = PurchaseRequisition::orderBy('purchase_requisition_number', 'desc')->first();
            $reqno = $latestRequisition ? (int) $latestRequisition->purchase_requisition_number : 0;
            $increment = 1;
            foreach ($BusinessTrip as $key => $value) {
                # code...
                $data = $this->preparePurchaseRequisitionData($value, $increment, $reqno, $attachment);
                PurchaseOrder::create($data);
                $array[] = $data;
                $increment++;
            }

            $this->generateFiles($array, $arrayCash, $reqno);

            DB::commit();
            return $array;
        } catch (Exception $e) {
            dd($e);
            DB::rollBack();
            throw new Exception($e->getMessage());
        }
    }

    private function preparePurchaseRequisitionData($BusinessTrip, $increment, $reqno, $attachment)
    {
        $formattedDate = Carbon::parse($BusinessTrip->created_at)->format('Y-m-d');
        $data = [
            'code_transaction' => 'btre',
            'purchasing_document_date' => $formattedDate, // bedat
            'purchasing_document_type' => 'YSUN', // bsart
            'company_code' => '1600', //bukrs
            'purchasing_document_number' => $reqno, //ebeln
            'purchasing_group' => $BusinessTrip->purchasing_group, // ekgrp
            'purchasing_organization' =>  '1600', // ekorg
            'incoterms_part1' => '', // inco1
            'incoterms_part2' => '', // inco2
            'vendor_account_number' => $BusinessTrip->desired_vendor, // lifnr
            'currency_key' => 'IDR', // waers
            'terms_of_payment_key' => 'D030', //zterm
            'requisitioner_name' => $BusinessTrip->desired_vendor, //afnam
            'purchase_requisition_number'  => $BusinessTrip->purchase_requisition_number, // banfn
            'requirement_tracking_number' => '', // bednr
            'item_number_of_purchase_requisition' => $BusinessTrip->item_number, // bnfpo
            'purchasing_document_number' => $reqno, //ebeln
            'item_number_of_purchasing_document' => $increment, // ebelp
            'delivery_completed_indicator' => '', // elikz
            'final_invoice_indicator' => '', // erekz
            'account_assignment_category' => 'Y', // knttp
            'storage_location' => '0001', // lgort
            'material_group' => $BusinessTrip->material_group, //matkl
            'material_number' => $BusinessTrip->material_number, // matnr
            'po_unit_of_measure' => $BusinessTrip->uom, // meins
            'po_quantity' => 1, // menge
            'tax_code' => $BusinessTrip->tax_code, //mwskz
            'net_price' => '100000', // netpr
            'item_category' => '', // pstyp
            'invoice_receipt_indicator' => '', // repos
            'short_text' => $BusinessTrip->remark, // txz01
            'gr_based_invoice_verification' => '', // webre
            'goods_receipt_indicator' => '', // wepos
            'plant' => 'ID01', // werks
            'main_asset_number' => '', // anln1
            'asset_subnumber' => '', // anln2
            'order_number' => '', // aufnr
            'cost_center' => $BusinessTrip->cost_center,
            'purchasing_document_date' => $formattedDate, // bedat
            'F81' => '', //           F81
            'F82' => '', //           F82
            'F83' => '', //           F83
            'F84' => '', //           F84
            'F85' => '', //           F85
            'F86' => '', //           F86
            'F87' => '', //           F87
            'F88' => '', //           F88
            'F89' => '', //           F89
            'F02' => '', //           F02
            'F01' => '', //           F01
            'F03' => '', //           F03
            'F04' => '', //           F04
            'Attachment_link' => $attachment, //           Attachment_link
        ];
        return $data;
    }

    private function findBusinessTripPr($id)
    {
        $items = PurchaseRequisition::where('purchase_id', $id)->where('code_transaction', 'BTRE')->get();
        return $items;
    }

    private function findBusinessAttachment($id)
    {
        $items = BusinessTripAttachment::where('business_trip_id', $id)->get();
        $attachmentString = $items->map(function ($attachment, $index) {
            $rowNumber = str_pad($index + 1, 2, '0', STR_PAD_LEFT); // Format row number to 2 digits
            $title = "business_trip_$rowNumber";
            $url =   url("storage/business_trip/{$attachment->file_name}");

            return "{$title};{$url}";
        })->implode('$');
        return $attachmentString;
    }

    private function generateFiles($array, $arrayCash, $reqno)
    {
        $timestamp = date('Ymd_His');

        // Generate Purchase Requisition File
        $filename = 'INB_POCRT_' . $reqno . '_' . $timestamp . '.txt';
        $fileContent = $this->convertArrayToFileContent($array);
        Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($filename, $fileContent);
    }

    private function convertArrayToFileContent($array)
    {
        return implode(PHP_EOL, array_map(fn($item) => implode("|", $item), $array)) . PHP_EOL;
    }
}
