<?php

namespace Modules\PurchaseRequisition\Services;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Modules\Approval\Models\SettingApproval;
use Modules\BusinessTrip\Models\AllowanceItem;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\BusinessTrip\Models\BusinessTripAttachment;
use Modules\BusinessTrip\Models\BusinessTripDestination;
use Modules\BusinessTrip\Models\BusinessTripDetailAttedance;
use Modules\Master\Models\MasterCostCenter;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\PurchasingGroup;
use Modules\Master\Models\Uom;
use Modules\PurchaseRequisition\Models\CashAdvance;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;

class BtService
{
    public function processTextData($id)
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
                $datainsert = $this->preparePurchaseRequisitionData(
                    $BusinessTrip,
                    $value,
                    $reqno,
                    $BusinessAttachment,
                    $key + 1,
                    $dokumenType,
                    $settings
                );

                $dataMapping = $datainsert;
                $dataMapping['purchase_id'] = $BusinessTrip->id;
                PurchaseRequisition::create($dataMapping);
                $array[] = $datainsert;
                if ($BusinessTrip->cash_advance) {
                    $datainsertCash = $this->prepareCashAdvanceData($BusinessTrip, $value, $reqno, $settings);

                    $newDataInser = $datainsertCash;
                    $newDataInser['amount'] = $BusinessTrip->total_cash_advance;
                    $newDataInser['purchase_id'] = $BusinessTrip->id;
                    CashAdvance::create($newDataInser);
                    $arrayCash[] = $datainsertCash;
                }
                # code...
            }

            // $this->generateFiles($array, $arrayCash, $reqno);
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
        $item,
        $reqno,
        $BusinessAttachment,
        $indx,
        $dokumenType,
        $settings,
    ) {
        $formattedDate = Carbon::parse($BusinessTrip->created_at)->format('Y-m-d');
        $getAllowanceItem = AllowanceItem::where('id', $item->allowance_item_id)->first();
        if ($getAllowanceItem && $getAllowanceItem->material_number == '') {
            throw new Exception('alloean Item Not set materila number');
        }

        $purchasingGroup = PurchasingGroup::find($BusinessTrip->purchasing_group_id);
        $uom = Uom::find($BusinessTrip->uom_id);
        $pajak = Pajak::find($BusinessTrip->pajak_id);
        $costCenter = MasterCostCenter::find($BusinessTrip->pajak_id);

        return [
            'code_transaction' => 'BTRE', // code_transaction
            'purchase_requisition_number' => $reqno, // banfn
            'item_number' => $indx, //
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
            'unit_of_measure' => $uom->commercial ?? '', // meins
            'quantity' => '1', // menge
            'balance' => $item->price, // NILAI NYA
            'waers' => 'IDR', // MATA UANG
            'tax_code' => $pajak->mwszkz ?? 'V0', // mwskz
            'item_category' => '', // pstyp
            'short_text' => $BusinessTrip->remarks, // txz01
            'plant' => $settings['plant'], // werks
            'cost_center' => $costCenter->cost_center, // kostl
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
            'header_not' => '', // b01
            'B01' => $BusinessTrip->remark,
            'B03' => $BusinessTrip->remark,
            'B04' => $BusinessTrip->remark,
            'attachment_link' => $BusinessAttachment,
        ];
    }

    private function findBusinessTrip($id)
    {
        $items = BusinessTrip::with('requestFor.employee')->find($id);
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
        $items = BusinessTripDestination::find($id);
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
                'business_trip_destination_id',
                'business_trip_id',
                'price',
                'allowance_item_id',
                DB::raw("'total' as type") // Add a 'type' column to differentiate the data
            )
            ->where('business_trip_id', $id);

        // Query for BusinessTripDetailDestinationDayTotal
        $dayTotalQuery = DB::table('business_trip_detail_destination_day_totals')
            ->select(
                'business_trip_destination_id',
                'business_trip_id',
                'price',
                'allowance_item_id',
                DB::raw("'day_total' as type") // Add a 'type' column to differentiate the data
            )
            ->where('business_trip_id', $id);

        // Merge the two queries using union
        $mergedQuery = $totalQuery->union($dayTotalQuery)->get();
        return $mergedQuery;
    }

    private function prepareCashAdvanceData($BusinessTrip, $item, $reqno, $settings)
    {
        $tax = Pajak::where('id', $BusinessTrip->pajak_id ?? '1')->first();
        $findCostCenter = MasterCostCenter::find($BusinessTrip->cost_center_id)->first();
        $taxAmount = $BusinessTrip->total_cash_advance * (($tax->desimal ?? 0) / 100);

        $findBusinessTripDestination = $this->findBusinessTripDestination($item->business_trip_destination_id);

        $formattedDate = Carbon::parse($findBusinessTripDestination->business_trip_start_date)->format('Y-m-d');
        $year = Carbon::parse($findBusinessTripDestination->business_trip_start_date)->format('Y');
        $month = Carbon::parse($findBusinessTripDestination->business_trip_start_date)->format('m');
        return [
            'extdoc' => $BusinessTrip->id,
            'code_transaction' => 'BTRE',
            'belnr' => $BusinessTrip->id, // belnr
            'company_code' => $settings['companyCode'], // bukrs
            'gjahr' =>  $year, // gjahr
            'currency' => 'IDR', // waers
            'document_date' => $formattedDate,
            'budat' => $formattedDate, // budat
            'monat' => $month, // monat
            'reference' => $BusinessTrip->request_no,
            'document_header_text' => $BusinessTrip->remarks,
            'vendor_code' => $BusinessTrip->requestFor->employee->partner_number ?? '',
            'saknr' => '', //saknr
            'hkont' => '', //hkont
            'amount_local_currency' => (int)$BusinessTrip->total_cash_advance + (int)$taxAmount,
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
