<?php

namespace Modules\PurchaseRequisition\Services;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Modules\PurchaseRequisition\Models\CashAdvance;
use Modules\PurchaseRequisition\Models\PurchaseOrder;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;

class TextPoServices
{
    public function processTextData($id, $code)
    {
        DB::beginTransaction();
        try {

            $po = PurchaseOrder::where('purchase_id', $id)->get();
            $array = [];
            $reqno = '';
            foreach ($po as $key => $value) {
                $datainsert = $this->preparePurchaseRequisitionData($value);
                $reqno = $value->purchasing_document_number;
                $array[] = $datainsert;
            }

            $this->generateFiles($array, $reqno);

            DB::commit();
            return $array;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception($e->getMessage());
        }
    }

    private function preparePurchaseRequisitionData($pr)
    {
        return [
            'code_transaction' => 'BTRDE',
            'purchasing_document_date' => $pr->purchasing_document_date, // bedat
            'purchasing_document_type' => $pr->purchasing_document_type, // bsart
            'company_code' => $pr->company_code, //bukrs
            'purchasing_document_number' => $pr->purchasing_document_number, //ebeln
            'purchasing_group' => $pr->purchasing_group, // ekgrp
            'purchasing_organization' =>  $pr->purchasing_organization, // ekorg
            'incoterms_part1' => '', // inco1
            'incoterms_part2' => '', // inco2
            'vendor_account_number' => $pr->vendor_account_number, // lifnr
            'currency_key' => 'IDR', // waers
            'terms_of_payment_key' => $pr->terms_of_payment_key, //zterm
            'requisitioner_name' => $pr->desired_vendor, //afnam
            'purchase_requisition_number'  => $pr->purchase_requisition_number, // banfn
            'requirement_tracking_number' => '', // bednr
            'item_number_of_purchase_requisition' => $pr->item_number_of_purchase_requisition, // bnfpo
            'purchasing_document_number' => $pr->purchasing_document_number, //ebeln
            'item_number_of_purchasing_document' => $pr->item_number_of_purchasing_document, // ebelp
            'delivery_completed_indicator' => '', // elikz
            'final_invoice_indicator' => '', // erekz
            'account_assignment_category' => $pr->account_assignment_category, // knttp
            'storage_location' => $pr->storage_location, // lgort
            'material_group' => $pr->material_group, //matkl
            'material_number' => $pr->material_number, // matnr
            'po_unit_of_measure' => $pr->po_unit_of_measure, // meins
            'po_quantity' => $pr->po_quantity, // menge
            'tax_code' => $pr->tax_code, //mwskz
            'net_price' => $pr->net_price, // netpr
            'item_category' => '', // pstyp
            'invoice_receipt_indicator' => '', // repos
            'short_text' => $pr->short_text, // txz01
            'gr_based_invoice_verification' => '', // webre
            'goods_receipt_indicator' => '', // wepos
            'plant' => $pr->plant, // werks
            'main_asset_number' => '', // anln1
            'asset_subnumber' => '', // anln2
            'order_number' => '', // aufnr
            'cost_center' => $pr->cost_center,
            'purchasing_document_date' => $pr->purchasing_document_date, // bedat
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
            'attachment_link' => $pr->attachment_link, //           Attachment_link
        ];
    }

    private function generateFiles($array, $nopr)
    {
        $timestamp = date('Ymd_His');

        // Generate Purchase Requisition File
        $filename = 'INB_POCRT_' . $nopr . '_' . $timestamp . '.txt';
        $fileContent = $this->convertArrayToFileContent($array);
        Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($filename, $fileContent);
        Storage::disk('local')->put($filename, $fileContent);
    }

    private function convertArrayToFileContent($array)
    {
        return implode(PHP_EOL, array_map(fn($item) => implode("|", $item), $array)) . PHP_EOL;
    }
}
