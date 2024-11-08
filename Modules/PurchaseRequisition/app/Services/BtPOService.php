<?php

namespace Modules\PurchaseRequisition\Services;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Modules\Approval\Models\SettingApproval;
use Modules\BusinessTrip\Models\BusinessTripAttachment;
use Modules\PurchaseRequisition\Models\PurchaseOrder;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;

class BtPOService
{
    public function processTextData($id)
    {
        DB::beginTransaction();
        try {

            $BusinessTrip = $this->findBusinessTripPr($id);
            $attachment = $this->findBusinessAttachment($id);
            $array = [];
            // Collect SettingApproval values
            $settings = SettingApproval::whereIn('key', [
                'dokumenType_po',
                'PurchasingOrganization',
                'AccountAssignmentCategory',
                'StorageLocation',
                'PurchaseRequisitionQuantity',
                'plant',
                'companyCode',
                'TermsofPaymentKey'
            ])->pluck('value', 'key');

            $dokumenType = $settings['dokumenType_po'];
            $reqno = (int) SettingApproval::where('key', 'dokumenType_' . $dokumenType)->lockForUpdate()->value('value') + 1;
            $increment = 1;

            foreach ($BusinessTrip as $key => $value) {
                # code...
                $data = $this->preparePurchaseRequisitionData(
                    $value,
                    $increment,
                    $reqno,
                    $attachment,
                    $dokumenType,
                    $settings['companyCode'],
                    $settings['TermsofPaymentKey'],
                    $settings['AccountAssignmentCategory'],
                    $settings['StorageLocation'],
                    $settings['PurchasingOrganization'],
                );
                PurchaseOrder::create($data);
                $array[] = $data;
                $increment++;
            }

            SettingApproval::where('key', 'dokumenType_' . $dokumenType)->update(['value' => $reqno]);
            DB::commit();
            return $array;
        } catch (Exception $e) {
            dd($e);
            DB::rollBack();
            throw new Exception($e->getMessage());
        }
    }

    private function preparePurchaseRequisitionData(
        $BusinessTrip,
        $increment,
        $reqno,
        $attachment,
        $dokumenType,
        $companyCode,
        $TermsofPaymentKey,
        $AccountAssignmentCategory,
        $StorageLocation,
        $PurchasingOrganization,
    ) {
        $formattedDate = Carbon::parse($BusinessTrip->created_at)->format('Y-m-d');
        $data = [
            'purchase_id' => $BusinessTrip->purchase_id,
            'code_transaction' => 'BTRE',
            'purchasing_document_date' => $formattedDate, // bedat
            'purchasing_document_type' => $dokumenType, // bsart
            'company_code' => $companyCode, //bukrs
            'purchasing_document_number' => $reqno, //ebeln
            'purchasing_group' => $BusinessTrip->purchasing_group, // ekgrp
            'purchasing_organization' =>  $PurchasingOrganization, // ekorg
            'incoterms_part1' => '', // inco1
            'incoterms_part2' => '', // inco2
            'vendor_account_number' => $BusinessTrip->desired_vendor, // lifnr
            'currency_key' => 'IDR', // waers
            'terms_of_payment_key' => $TermsofPaymentKey, //zterm
            'requisitioner_name' => $BusinessTrip->desired_vendor, //afnam
            'purchase_requisition_number'  => $BusinessTrip->purchase_requisition_number, // banfn
            'requirement_tracking_number' => '', // bednr
            'item_number_of_purchase_requisition' => $BusinessTrip->item_number, // bnfpo
            'purchasing_document_number' => $reqno, //ebeln
            'item_number_of_purchasing_document' => $increment, // ebelp
            'delivery_completed_indicator' => '', // elikz
            'final_invoice_indicator' => '', // erekz
            'account_assignment_category' => $AccountAssignmentCategory, // knttp
            'storage_location' => $StorageLocation, // lgort
            'material_group' => $BusinessTrip->material_group, //matkl
            'material_number' => $BusinessTrip->material_number, // matnr
            'po_unit_of_measure' => $BusinessTrip->unit_of_measure, // meins
            'po_quantity' => 1, // menge
            'tax_code' => $BusinessTrip->tax_code, //mwskz
            'net_price' => $BusinessTrip->balance, // netpr
            'item_category' => '', // pstyp
            'invoice_receipt_indicator' => 'X', // repos
            'short_text' => $BusinessTrip->remarks, // txz01
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
            'attachment_link' => $attachment, //           Attachment_link
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
}
