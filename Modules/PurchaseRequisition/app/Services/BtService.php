<?php

namespace Modules\PurchaseRequisition\Services;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Modules\Approval\Models\SettingApproval;
use Modules\BusinessTrip\Models\AllowanceItem;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\BusinessTrip\Models\BusinessTripAttachment;
use Modules\BusinessTrip\Models\BusinessTripDestination;
use Modules\BusinessTrip\Models\BusinessTripDetailAttedance;
use Modules\Master\Models\MasterCostCenter;
use Modules\Master\Models\MasterMaterial;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\PurchasingGroup;
use Modules\Master\Models\Uom;
use Modules\PurchaseRequisition\Models\CashAdvance;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;

class BtService
{
    public function processTextData($id, $saveToFile = true)
    {
        DB::beginTransaction();
        try {
            $BusinessTrip = $this->findBusinessTrip($id);
            $BusinessAttachment = $this->findBusinessAttachment($id);
            $BusinessTripDetailDestinationTotal = $this->findBusinessTripDetailDestinationTotal($id);

            $settings = SettingApproval::whereIn('key', [
                'dokumenType_bussinessTrip',
                'PurchasingOrganization',
                'AccountAssignmentCategory',
                'StorageLocation',
                'PurchaseRequisitionQuantity',
                'plant',
                'companyCode',
                'TermsofPaymentKey'
            ])->pluck('value', 'key');

            $array = [];
            $arrayCash = [];
            $dokumenType = $settings['dokumenType_bussinessTrip'];
            $reqno = (int) SettingApproval::where('key', 'dokumenType_' . $dokumenType)->lockForUpdate()->value('value') + 1;

            foreach ($BusinessTripDetailDestinationTotal as $key => $value) {
                $getDestination = $this->findBusinessTripDestination($value->business_trip_destination_id);

                $datainsert = $this->preparePurchaseRequisitionData([
                    'BusinessTrip' => $BusinessTrip,
                    'item' => $value,
                    'reqno' => $reqno,
                    'BusinessAttachment' => $BusinessAttachment,
                    'indx' => $key + 1,
                    'dokumenType' => $dokumenType,
                    'settings' => $settings,
                    'getDestination' => $getDestination
                ]);
                $dataMapping = $datainsert;

                if ($saveToFile) {
                    $dataMapping['purchase_id'] = $BusinessTrip->id;
                    $dataMapping['business_trip_day_total_id'] = $value->id;
                    $dataMapping['business_trip_day_total_type'] = $value->type;
                    PurchaseRequisition::create($dataMapping);
                    $array[] = $datainsert;
                } else {
                    $dataMapping['business_trip_day_total_id'] = $value->parent_id;
                    $dataMapping['business_trip_day_total_type'] = $value->type;
                    $array[] = $dataMapping;
                }
            }

            if ($BusinessTrip->cash_advance == 1) {
                $datainsertCash = $this->prepareCashAdvanceData($BusinessTrip, $reqno, $settings);

                if ($saveToFile) {
                    $newDataInser = $datainsertCash;
                    $newDataInser['amount'] = $BusinessTrip->total_cash_advance;
                    $newDataInser['purchase_id'] = $BusinessTrip->id;
                    CashAdvance::create($newDataInser);
                }

                $arrayCash[] = $datainsertCash;
            }


            // $this->generateFiles($array, $arrayCash, $reqno);
            if ($saveToFile) {
                SettingApproval::where('key', 'dokumenType_' . $dokumenType)->update(['value' => $reqno]);
            }

            DB::commit();
            return $array;
        } catch (Exception $e) {
            DB::rollBack();
            Log::channel('bt_txt')->error($e->getMessage(), ['id' => $id]);
            throw new Exception($e->getMessage());
        }
    }

    private function preparePurchaseRequisitionData(array $params)
    {
        $BusinessTrip = $params['BusinessTrip'];
        $item = $params['item'];
        $reqno = $params['reqno'];
        $BusinessAttachment = $params['BusinessAttachment'];
        $indx = $params['indx'];
        $dokumenType = $params['dokumenType'];
        $settings = $params['settings'];
        $getDestination = $params['getDestination'];

        $formattedDate = Carbon::parse($BusinessTrip->created_at)->format('Y-m-d');
        $getAllowanceItem = AllowanceItem::where('id', $item->allowance_item_id)->first();
        if ($getAllowanceItem && $getAllowanceItem->material_number == '') {
            throw new Exception('allowance Item Not set materila number');
        }
        // get material number
        $cleaned = ltrim($getAllowanceItem->material_number, '0');

        $getMaterial = MasterMaterial::whereRaw("ltrim(material_number, '0') = ?", [$cleaned])->first();
        if (!$getMaterial) {
            throw new Exception('materila number not found');
        }

        $internalUom = Uom::where('internal_uom', $getMaterial->base_unit_of_measure ?? '')->first();


        $purchasingGroup = PurchasingGroup::find($getDestination->purchasing_group_id);
        $pajak = Pajak::find($getDestination->pajak_id);
        $costCenter = MasterCostCenter::find($BusinessTrip->cost_center_id);

        if (!$BusinessTrip->purposeType) {
            throw new Exception('Purchasing Group not found');
        }


        $name = substr($getAllowanceItem->name, 0, 3);
        $words = explode(' ', $BusinessTrip->purposeType->name);
        $purposeType = $words[0];
        $wordrequestFors = explode(' ', $BusinessTrip->requestFor->name);
        $destinationShort = substr($getDestination->destination, 0, 10);
        $requestFor = $wordrequestFors[0] ?? '';
        $businessTripStartDateFormatted = date("Md", strtotime($getDestination->business_trip_start_date));

        $shortText = strtoupper("{$name}{$purposeType}-{$requestFor}-{$destinationShort}-{$businessTripStartDateFormatted}");


        return [
            'code_transaction' => 'BTRE', // code_transaction
            'purchase_requisition_number' => $item->price  == "0" ? '' : $reqno, // banfn
            'item_number' => $item->price  == "0" ? null : $indx, //
            'requisitioner_name' => $BusinessTrip->requestFor->employee->partner_number ?? '', // afnam
            'requisition_date' => $formattedDate, // badat
            'requirement_tracking_number' => '', // bednr
            'document_type' => $dokumenType, //bsart
            'valuation_type' => '', //bwtar
            'is_closed' => '', // ebakz
            'purchasing_group' => $purchasingGroup->purchasing_group, // perlu input // ekgrp
            'purchasing_organization' => $settings['PurchasingOrganization'], // ekorg
            'account_assignment_category' => $settings['AccountAssignmentCategory'], // knttp
            'item_delivery_date' => $formattedDate, // lfdat
            'storage_location' => $settings['StorageLocation'], // lgort
            'desired_vendor' => $BusinessTrip->requestFor->employee->partner_number ?? '', // lifnr
            'material_group' => $getAllowanceItem->material_group, // matkl
            'material_number' => $getAllowanceItem->material_number, // matnr
            'unit_of_measure' => $internalUom->commercial ?? '', // meins
            'quantity' => '1', // menge
            'balance' => $item->price, // NILAI NYA
            'waers' => 'IDR', // MATA UANG
            'tax_code' => $pajak->mwszkz ?? 'V0', // mwskz
            'item_category' => '', // pstyp
            'short_text' => $shortText, // txz01
            'plant' => $settings['plant'], // werks
            'cost_center' => $costCenter?->cost_center, // kostl
            'order_number' => '', // AUFNR
            'asset_subnumber' => '', // anln2
            'main_asset_number' => '', // anln1
            'tanggal_entertainment' => '', // b81
            'tempat_entertainment' => '',
            'alamat_entertainment' => '',
            'jenis_entertainment' => '',
            'nama_entertainment' => '',
            'posisi_entertainment' => '',
            'nama_perusahaan' => '',
            'jenis_usaha_entertainment' => '',
            'jenis_kegiatan_entertainment' => '',
            'header_not' => $BusinessTrip->remarks ?? '', // b01
            'B01' => $BusinessTrip->remark,
            'B03' => $BusinessTrip->remark,
            'B04' => $BusinessTrip->remark,
            'attachment_link' => $BusinessAttachment,
        ];
    }

    private function findBusinessTrip($id)
    {
        $items = BusinessTrip::with('requestFor.employee', 'purposeType')->find($id);
        if (!$items) {
            throw new Exception(' Business Trip not found');
        }
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

    private function findBusinessTripDestination($id)
    {
        $items = BusinessTripDestination::where('id', $id)->first();
        return $items;
    }
    private function findBusinessTripDetailAttedance($id)
    {
        $items = BusinessTripDetailAttedance::where('business_trip_id', $id)->get();
        return $items;
    }
    private function findBusinessTripDetailDestinationTotal($id)
    {

        $totalQuery = DB::table('business_trip_detail_destination_totals')
            ->select(
                'id',
                'business_trip_destination_id',
                'business_trip_id',
                'price',
                'allowance_item_id',
                'parent_id',
                DB::raw("'total' as type") // Add a 'type' column to differentiate the data
            )
            ->where('business_trip_id', $id);

        // Query for BusinessTripDetailDestinationDayTotal
        $dayTotalQuery = DB::table('business_trip_detail_destination_day_totals')
            ->select(
                'id',
                'business_trip_destination_id',
                'business_trip_id',
                'price',
                'allowance_item_id',
                'parent_id',
                DB::raw("'day_total' as type") // Add a 'type' column to differentiate the data
            )
            ->where('business_trip_id', $id);

        // Merge the two queries using union
        $mergedQuery = $totalQuery->unionAll($dayTotalQuery)->orderBy('price', 'desc')->get();
        return $mergedQuery;
    }


    private function prepareCashAdvanceData($BusinessTrip, $reqno, $settings)
    {

        $tax = Pajak::where('id', $BusinessTrip->pajak_id)->orWhere('mwszkz', 'V0')->first();
        $findCostCenter = MasterCostCenter::find($BusinessTrip->cost_center_id)->first();
        $totalAmount = (int)$BusinessTrip->total_cash_advance;

        $desimalPlus = 100 + $tax->desimal;
        $taxAmount = ($tax->desimal / $desimalPlus) * $totalAmount;


        $formattedDate = Carbon::parse($BusinessTrip->created_at)->format('Y-m-d');
        $year = Carbon::parse($BusinessTrip->created_at)->format('Y');
        $month = Carbon::parse($BusinessTrip->created_at)->format('m');
        return [
            'extdoc' => $BusinessTrip->id,
            'code_transaction' => 'BTRE',
            'belnr' => $BusinessTrip->id, // belnr
            'company_code' => $settings['companyCode'], // bukrs
            'gjahr' =>  '', // gjahr
            'currency' => 'IDR', // waers
            'document_date' => $formattedDate,
            'budat' => $formattedDate, // budat
            'monat' => $month, // monat
            'reference' => $BusinessTrip->reference_number,
            'document_header_text' => $BusinessTrip->remarks,
            'vendor_code' => $BusinessTrip->requestFor->employee->partner_number ?? '',
            'saknr' => '', //saknr
            'hkont' => '', //hkont
            'amount_local_currency' => (int)$BusinessTrip->total_cash_advance,
            'tax_code' => $tax->mwszkz ?? 'V0',
            'dzfbdt' => $formattedDate, //dzfbdt
            'purchasing_document' => '', //ebeln
            'purchasing_document_item' => '', //ebelp
            'assigment' => $reqno,
            'text' => 'DP ' . $BusinessTrip->total_percent,
            'profit_center' => $findCostCenter->cost_center,
            'tax_amount' => $taxAmount,
        ];
    }
}
