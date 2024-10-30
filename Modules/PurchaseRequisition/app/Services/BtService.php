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
use Modules\PurchaseRequisition\Models\PurchaseRequisition;

class BtService
{
    public function processTextData($id, $btName)
    {
        DB::beginTransaction();
        try {

            $BusinessTrip = $this->findBusinessTrip($id);
            $BusinessAttachment = $this->findBusinessAttachment($id);
            $BusinessTripDetailDestinationTotal = $this->findBusinessTripDetailDestinationTotal($id);


            $latestRequisition = PurchaseRequisition::orderBy('purchase_requisition_number', 'desc')->first();
            $reqno = $latestRequisition ? (int) $latestRequisition->purchase_requisition_number : 4300000022;

            $array = [];
            $arrayCash = [];

            foreach ($BusinessTripDetailDestinationTotal as $key => $value) {
                $reqno++;
                $datainsert = $this->preparePurchaseRequisitionData($BusinessTrip, $btName, $value, $reqno, $BusinessAttachment, $key + 1);

                $dataMapping = $datainsert;
                $dataMapping['purchase_id'] = $BusinessTrip->id;
                PurchaseRequisition::create($dataMapping);
                $array[] = $datainsert;
                if ($BusinessTrip->cash_advance) {
                    $datainsertCash = $this->prepareCashAdvanceData($BusinessTrip, $value, $reqno);

                    $newDataInser = $datainsertCash;
                    $newDataInser['amount'] = $BusinessTrip->total_cash_advance;
                    $newDataInser['purchase_id'] = $BusinessTrip->id;
                    CashAdvance::create($newDataInser);
                    $arrayCash[] = $datainsertCash;
                }
                # code...
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

    private function preparePurchaseRequisitionData($BusinessTrip, $btName, $item, $reqno, $BusinessAttachment, $indx)
    {
        $formattedDate = Carbon::parse($BusinessTrip->created_at)->format('Y-m-d');
        $getAllowanceItem = AllowanceItem::where('id', $item->allowance_item_id)->first();
        if ($getAllowanceItem && $getAllowanceItem->material_number == '') {
            throw new Exception('alloean Item Not set materila number');
        }

        return [
            'code_transaction' => $btName, // code_transaction
            'purchase_requisition_number' => $reqno, // banfn
            'item_number' => $indx, //
            'requisitioner_name' => $BusinessTrip->requestFor->employee->partner_number ?? '', // afnam
            'requisition_date' => $formattedDate, // badat
            'requirement_tracking_number' => '', // bednr
            'document_type' => 'ZSUN', //bsart
            'valuation_type' => '', //bwtar
            'is_closed' => '', // ebakz
            'purchasing_group' => 'A01', // perlu input // ekgrp
            'purchasing_organization' => '1600', // ekorg
            'account_assignment_category' => 'Y', // knttp
            'item_delivery_date' => $formattedDate, // lfdat
            'storage_location' => '0001', // lgort
            'desired_vendor' => $BusinessTrip->requestFor->employee->partner_number ?? '', // lifnr
            'material_group' => $getAllowanceItem->material_group ?? 'NC_SRVC', // matkl
            'material_number' => $getAllowanceItem->material_number, // matnr
            'unit_of_measure' => 'AU', // meins
            'quantity' => '1', // menge
            'netpr' => $item->price, // NILAI NYA
            'waers' => 'IDR', // MATA UANG
            'tax_code' => 'V0', // mwskz
            'item_category' => '', // pstyp
            'short_text' => $BusinessTrip->remark, // txz01
            'plant' => 'ID01', // werks
            'cost_center' => '0000000100', // kostl
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
            'Attachment_link' => $BusinessAttachment,
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

    private function prepareCashAdvanceData($BusinessTrip, $item, $reqno)
    {
        $tax = Pajak::where('mwszkz', $item->tax ?? 'V0')->first();
        $taxAmount = $BusinessTrip->total_cash_advance - ($BusinessTrip->total_cash_advance * (($tax->desimal ?? 0) / 100));

        $findBusinessTripDestination = $this->findBusinessTripDestination($item->business_trip_destination_id);

        $formattedDate = Carbon::parse($findBusinessTripDestination->business_trip_start_date)->format('Y-m-d');
        $year = Carbon::parse($findBusinessTripDestination->business_trip_start_date)->format('Y');
        $month = Carbon::parse($findBusinessTripDestination->business_trip_start_date)->format('m');

        return [
            'code_transaction' => 'VEN',
            'belnr' => $BusinessTrip->id, // belnr
            'company_code' => '1600', // bukrs
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
            'amount_local_currency' => $BusinessTrip->total_cash_advance,
            'tax_code' => $item->tax ?? 'V0',
            'dzfbdt' => $formattedDate, //dzfbdt
            'purchasing_document' => '', //ebeln
            'purchasing_document_item' => '', //ebelp
            'assigment' => $reqno,
            'text' => 'DP ' . $BusinessTrip->total_percent,
            'profit_center' => '0000000100',
            'tax_amount' => $taxAmount,
        ];
    }

    private function generateFiles($array, $arrayCash, $nopr)
    {
        $timestamp = date('Ymd_His');

        // Generate Purchase Requisition File
        $filename = 'INB_PRCRT_' . $nopr . '_' . $timestamp . '.txt';
        $fileContent = $this->convertArrayToFileContent($array);
        Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($filename, $fileContent);

        // Generate Cash Advance File (if applicable)
        if (!empty($arrayCash)) {
            $filenameAc = 'INB_DPCRT_' . $nopr . '_' . $timestamp . '.txt';
            $fileContentAc = $this->convertArrayToFileContent($arrayCash);
            Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($filenameAc, $fileContentAc);
        }
    }

    private function convertArrayToFileContent($array)
    {
        return implode(PHP_EOL, array_map(fn($item) => implode("|", $item), $array)) . PHP_EOL;
    }
}
