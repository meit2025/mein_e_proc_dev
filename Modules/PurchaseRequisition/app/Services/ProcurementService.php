<?php

namespace Modules\PurchaseRequisition\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Exception;
use Modules\Master\Models\MasterBusinessPartner;
use Modules\Master\Models\Pajak;
use Modules\PurchaseRequisition\Models\CashAdvance;
use Modules\PurchaseRequisition\Models\CashAdvancePurchases;
use Modules\PurchaseRequisition\Models\Entertainment;
use Modules\PurchaseRequisition\Models\Purchase;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;
use Modules\PurchaseRequisition\Models\Unit;
use Modules\PurchaseRequisition\Models\Vendor;

class ProcurementService
{
    public function processTextData($id)
    {
        DB::beginTransaction();
        try {
            $procurement = $this->findPurchase($id);
            $vendor = $this->findVendorWinner($procurement->id);
            $items = $this->findItems($vendor->id);
            $businessPartner = $this->getBusinessPartner($procurement->user_id);

            $array = [];
            $arrayCash = [];

            $latestRequisition = PurchaseRequisition::orderBy('purchase_requisition_number', 'desc')->first();
            $reqno = $latestRequisition ? (int) $latestRequisition->purchase_requisition_number : 0;

            $entertainment = Entertainment::where('purchase_id', $vendor->id)->first();
            $cashData = CashAdvancePurchases::where('purchase_id', $vendor->id)->first();

            foreach ($items as $value) {
                $reqno++;
                $datainsert = $this->preparePurchaseRequisitionData($procurement, $vendor, $value, $businessPartner, $reqno, $entertainment);
                $array[] = $datainsert;
                PurchaseRequisition::create($datainsert);

                if ($procurement->is_cashAdvance) {
                    $datainsertCash = $this->prepareCashAdvanceData($procurement, $vendor, $value, $cashData, $reqno);
                    CashAdvance::create($datainsertCash);
                    $arrayCash[] = $datainsertCash;
                }
            }

            // Generate and store files
            $this->generateFiles($array, $arrayCash);

            DB::commit();
            return $array;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception($e->getMessage());
        }
    }

    private function findPurchase($id)
    {
        $procurement = Purchase::find($id);
        if (!$procurement) {
            throw new Exception('PR not found');
        }
        return $procurement;
    }

    private function findVendorWinner($purchaseId)
    {
        $vendor = Vendor::with('masterBusinesPartnerss')->where('purchase_id', $purchaseId)->where('winner', true)->first();
        if (!$vendor) {
            throw new Exception('Vendor winner not found');
        }


        return $vendor;
    }

    private function findItems($vendorId)
    {
        $items = Unit::where('vendor_id', $vendorId)->get();
        if ($items->isEmpty()) {
            throw new Exception('Item not found');
        }
        return $items;
    }

    private function getBusinessPartner($userId)
    {
        $user = User::find($userId);
        if ($user && $user->master_business_partner_id) {
            $businessPartner = MasterBusinessPartner::find($user->master_business_partner_id);
            if (!$businessPartner) {
                throw new Exception('Business partner not found');
            }
            return $businessPartner;
        }
        return null;
    }

    private function preparePurchaseRequisitionData($procurement, $vendor, $item, $businessPartner, $reqno, $entertainment)
    {
        $formattedDate = Carbon::parse($procurement->created_at)->format('Y.m.d');
        $delivery_date = Carbon::parse($procurement->delivery_date)->format('Y.m.d');

        return [
            'purchase_id' => $procurement->id,
            'code_transaction' => 'ven', // code_transaction
            'purchase_requisition_number' => $reqno, //banfn
            'item_number' => $item->material_number,  // bnfpo
            'requisitioner_name' => $businessPartner ? $businessPartner->partner_number : '', // afnam
            'requisition_date' => $formattedDate,  // badat
            'requirement_tracking_number' => '', // bednr
            'document_type' => $procurement->document_type, // bsart
            'valuation_type' => '', //bwtar
            'is_closed' => '', // ebakz
            'purchasing_group' => $procurement->purchasing_groups, //bsart
            'purchasing_organization' => '1600', // ekorg
            'account_assignment_category' => $procurement->account_assignment_categories,  // knttp
            'item_delivery_date' => $delivery_date, // lfdat
            'storage_location' => $procurement->storage_locations,  // lgort
            'desired_vendor' => $vendor->masterBusinesPartnerss->partner_number ?? '',  // lifnr
            'material_group' => $item->material_group, // matkl
            'material_number' => $item->material_number, // matnr
            'unit_of_measure' => $item->uom,
            'quantity' => $item->qty,
            'netpr' => '',
            'waers' => '',
            'tax_code' => $item->tax, // mwskz
            'item_category' => '', // pstyp
            'short_text' => $item->short_text,  // txz01
            'plant' => 'ID01', // werks
            'cost_center' => $item->cost_center,  // kostl
            'order_number' => $item->order_number, // AUFNR
            'asset_subnumber' => $item->sub_asset_number,  // anln2
            'main_asset_number' => $item->asset_number,  // anln1
            'tanggal_entertainment' => $entertainment->tanggal ?? '',  // b81
            'tempat_entertainment' => $entertainment->tempat ?? '',  // b83
            'alamat_entertainment' => $entertainment->alamat ?? '',
            'jenis_entertainment' => $entertainment->jenis ?? '',
            'nama_entertainment' => $entertainment->nama ?? '',
            'posisi_entertainment' => $entertainment->posisi ?? '',
            'jenis_usaha_entertainment' => $entertainment->jenis_usaha ?? '',
            'jenis_kegiatan_entertainment' => $entertainment->jenis_kegiatan ?? '', // b89
            'header_not' => $entertainment->header_not ?? '', // b01
            'B01' => $item->short_text,
            'B03' => $item->short_text,
            'B04' => $item->short_text,
            'Attachment_link' => '',
        ];
    }

    private function prepareCashAdvanceData($procurement, $vendor, $item, $cashData, $reqno)
    {
        $tax = Pajak::where('mwszkz', $item->tax)->first();
        $taxAmount = $item->total_amount - ($item->total_amount * ($tax->desimal / 100));

        return [
            'purchase_id' => $procurement->id,
            'code_transaction' => 'dp',  // code_transaction
            'belnr' => '', // belnr
            'company_code' => '1600',
            'gjahr' => '', // gjahr
            'currency' => 'IDR', // waers
            'document_date' => $cashData->document_date, // bldat
            'budat' => '', // budat
            'monat' => '', // monat
            'reference' => $cashData->reference,  // xblnr
            'document_header_text' => $cashData->document_header_text, // bktxt
            'vendor_code' => $vendor->masterBusinesPartnerss->partner_number,  // lifnr
            'amount' => $item->total_amount, // lifnr
            'amount_local_currency' => $item->total_amount,
            'saknr' => '', //saknr
            'hkont' => '', //hkont
            'amount_local_currency' => $item->total_amount, //dmbtr
            'tax_code' => $item->tax,
            'dzfbdt' => '', //dzfbdt
            'assigment' => $reqno,
            'text' => 'DP ' . $item->tax . ' ' . $cashData->text,
            'profit_center' => $item->cost_center,
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
