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

        return [
            'purchase_id' => $procurement->id,
            'code_transaction' => 'ven',
            'purchase_requisition_number' => $reqno,
            'item_number' => $item->material_number,
            'requisitioner_name' => $businessPartner ? $businessPartner->partner_number : '',
            'requisition_date' => $formattedDate,
            'document_type' => $procurement->document_type,
            'purchasing_group' => $procurement->purchasing_groups,
            'purchasing_organization' => '1600',
            'account_assignment_category' => $procurement->account_assignment_categories,
            'item_delivery_date' => $formattedDate,
            'storage_location' => $procurement->storage_locations,
            'desired_vendor' => $vendor->masterBusinesPartnerss->partner_number ?? '',
            'material_group' => $item->material_group,
            'unit_of_measure' => $item->uom,
            'quantity' => $item->qty,
            'tax_code' => $item->tax,
            'short_text' => $item->short_text,
            'plant' => 'ID01',
            'cost_center' => $item->cost_center,
            'order_number' => $item->order_number,
            'asset_subnumber' => $item->sub_asset_number,
            'main_asset_number' => $item->asset_number,
            'tanggal_entertainment' => $entertainment->tanggal ?? '',
            'tempat_entertainment' => $entertainment->tempat ?? '',
            'alamat_entertainment' => $entertainment->alamat ?? '',
            'jenis_entertainment' => $entertainment->jenis ?? '',
            'nama_entertainment' => $entertainment->nama ?? '',
            'posisi_entertainment' => $entertainment->posisi ?? '',
            'jenis_usaha_entertainment' => $entertainment->jenis_usaha ?? '',
            'jenis_kegiatan_entertainment' => $entertainment->jenis_kegiatan ?? '',
            'header_not' => $entertainment->header_not ?? '',
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
            'code_transaction' => 'dp',
            'company_code' => '1600',
            'currency' => 'IDR',
            'document_date' => $cashData->document_date,
            'reference' => $cashData->reference,
            'document_header_text' => $cashData->document_header_text,
            'vendor_code' => $vendor->masterBusinesPartnerss->partner_number,
            'amount' => $item->total_amount,
            'amount_local_currency' => $item->total_amount,
            'tax_code' => $item->tax,
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
