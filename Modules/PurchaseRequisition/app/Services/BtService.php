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
            $reqno = $latestRequisition ? (int) $latestRequisition->purchase_requisition_number : 0;

            $array = [];
            $arrayCash = [];

            foreach ($BusinessTripDetailDestinationTotal as $key => $value) {
                $reqno++;
                $datainsert = $this->preparePurchaseRequisitionData($BusinessTrip, $btName, $value, $reqno, $BusinessAttachment);
                $array[] = $datainsert;

                if ($BusinessTrip->cash_advance) {
                    $datainsertCash = $this->prepareCashAdvanceData($BusinessTrip, $value, $reqno);
                    CashAdvance::create($datainsertCash);
                    $arrayCash[] = $datainsertCash;
                }
                # code...
            }

            $this->generateFiles($array, $arrayCash);

            DB::commit();
            return $array;
        } catch (Exception $e) {
            dd($e);
            DB::rollBack();
            throw new Exception($e->getMessage());
        }
    }

    private function preparePurchaseRequisitionData($BusinessTrip, $btName, $item, $reqno, $BusinessAttachment)
    {
        $formattedDate = Carbon::parse($BusinessTrip->created_at)->format('Y.m.d');
        $getAllowanceItem = AllowanceItem::where('id', $item->allowance_item_id)->first();
        if ($getAllowanceItem && $getAllowanceItem->material_number == '') {
            throw new Exception('alloean Item Not set materila number');
        }
        return [
            'purchase_id' => $BusinessTrip->id,
            'code_transaction' => $btName,
            'purchase_requisition_number' => $reqno,
            'item_number' => $getAllowanceItem->material_number,
            'requisitioner_name' => $BusinessTrip->requestFor->employee->partner_number ?? '',
            'requisition_date' => $formattedDate,
            'requirement_tracking_number' => '', // bednr
            'document_type' => 'ZSUN',
            'valuation_type' => '',
            'is_closed' => '', // ebakz
            'purchasing_group' => 'A01', // perlu input
            'purchasing_organization' => '1600',
            'account_assignment_category' => 'Y',
            'item_delivery_date' => $formattedDate,
            'storage_location' => '001',
            'desired_vendor' => $BusinessTrip->requestFor->employee->partner_number ?? '',
            'material_group' => $getAllowanceItem->material_group,
            'material_number' => $getAllowanceItem->material_number, // matnr
            'unit_of_measure' => '%',
            'quantity' => '1',
            'netpr' => '',
            'waers' => '',
            'tax_code' => '',
            'item_category' => '', // pstyp
            'short_text' => $BusinessTrip->remark,
            'plant' => 'ID01',
            'cost_center' => '0000000100',
            'order_number' => '',
            'asset_subnumber' => '',
            'main_asset_number' => '',
            'tanggal_entertainment' => '',
            'tempat_entertainment' => '',
            'alamat_entertainment' => '',
            'jenis_entertainment' => '',
            'nama_entertainment' => '',
            'posisi_entertainment' => '',
            'jenis_usaha_entertainment' => '',
            'jenis_kegiatan_entertainment' => '',
            'header_not' => '',
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

        $formattedDate = Carbon::parse($findBusinessTripDestination->business_trip_start_date)->format('Y.m.d');

        return [
            'purchase_id' => $BusinessTrip->id,
            'code_transaction' => 'dp',
            'company_code' => '1600',
            'currency' => 'IDR',
            'document_date' => $formattedDate,
            'reference' => $BusinessTrip->request_no,
            'document_header_text' => $BusinessTrip->remarks,
            'vendor_code' => $BusinessTrip->requestFor->employee->partner_number ?? '',
            'amount' => $BusinessTrip->total_cash_advance,
            'amount_local_currency' => $BusinessTrip->total_cash_advance,
            'tax_code' => $item->tax ?? 'V0',
            'assigment' => $reqno,
            'text' => 'DP ' . $BusinessTrip->total_percent,
            'profit_center' => '0000000100',
            'tax_amount' => $taxAmount,
        ];
    }

    private function generateFiles($array, $arrayCash)
    {
        $timestamp = date('Ymd_His');

        // Generate Purchase Requisition File
        $filename = 'INB_PRCRT_' . 1 . '_' . $timestamp . '.txt';
        $fileContent = $this->convertArrayToFileContent($array);
        Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($filename, $fileContent);

        // Generate Cash Advance File (if applicable)
        if (!empty($arrayCash)) {
            $filenameAc = 'INB_PRDP_' . 1 . '_' . $timestamp . '.txt';
            $fileContentAc = $this->convertArrayToFileContent($arrayCash);
            Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($filenameAc, $fileContentAc);
        }
    }

    private function convertArrayToFileContent($array)
    {
        return implode(PHP_EOL, array_map(fn($item) => implode("|", $item), $array)) . PHP_EOL;
    }
}
