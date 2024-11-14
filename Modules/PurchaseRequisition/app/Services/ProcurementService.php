<?php

namespace Modules\PurchaseRequisition\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Exception;
use Modules\Approval\Models\SettingApproval;
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

            $reqno = (int) SettingApproval::where('key', 'dokumenType_' . $procurement->document_type)->lockForUpdate()->value('value') + 1;

            $entertainment = Entertainment::where('purchase_id', $id)->first();
            $cashData = CashAdvancePurchases::where('purchase_id', $id)->first();


            foreach ($items as $key => $value) {
                $datainsert = $this->preparePurchaseRequisitionData(
                    $procurement,
                    $vendor,
                    $value,
                    $businessPartner,
                    $reqno,
                    $entertainment,
                    $key + 1,
                    $settings
                );
                $array[] = $datainsert;
                PurchaseRequisition::create($datainsert);

                if ($procurement->is_cashAdvance) {
                    $datainsertCash = $this->prepareCashAdvanceData($procurement, $vendor, $value, $cashData, $reqno, $settings);
                    CashAdvance::create($datainsertCash);
                    $arrayCash[] = $datainsertCash;
                }
            }

            SettingApproval::where('key', 'dokumenType_' . $procurement->document_type)->update(['value' => $reqno]);

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

    private function preparePurchaseRequisitionData($procurement, $vendor, $item, $businessPartner, $reqno, $entertainment, $inx, $settings)
    {
        $formattedDate = Carbon::parse($procurement->created_at)->format('Y-m-d');
        $delivery_date = Carbon::parse($procurement->delivery_date)->format('Y-m-d');

        return [
            'purchase_id' => $procurement->id,
            'code_transaction' => 'VEN', // code_transaction
            'purchase_requisition_number' => $reqno, //banfn
            'item_number' => $inx,  // bnfpo
            'requisitioner_name' => $businessPartner ? $businessPartner->partner_number : '', // afnam
            'requisition_date' => $formattedDate,  // badat
            'requirement_tracking_number' => '', // bednr
            'document_type' => $procurement->document_type, // bsart
            'valuation_type' => '', //bwtar
            'is_closed' => '', // ebakz
            'purchasing_group' => $procurement->purchasing_groups, //bsart
            'purchasing_organization' => $settings['PurchasingOrganization'], // ekorg
            'account_assignment_category' => $item->account_assignment_categories,  // knttp
            'item_delivery_date' => $delivery_date, // lfdat
            'storage_location' => $procurement->storage_locations,  // lgort
            'desired_vendor' => $vendor->masterBusinesPartnerss->partner_number ?? '',  // lifnr
            'material_group' => $item->material_group, // matkl
            'material_number' => $item->material_number, // matnr
            'unit_of_measure' => $item->uom,
            'quantity' => $item->qty,
            'balance' => round($item->total_amount, 0),
            'waers' => 'IDR',
            'tax_code' => $item->tax, // mwskz
            'item_category' => '', // pstyp
            'short_text' => $item->short_text,  // txz01
            'plant' => $settings['plant'], // werks
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
            'attachment_link' => '',
        ];
    }

    private function prepareCashAdvanceData($procurement, $vendor, $item, $cashData, $reqno, $settings)
    {
        $tax = Pajak::where('mwszkz', $item->tax)->first();
        $taxAmount = $item->total_amount - ($item->total_amount * ($tax->desimal / 100));

        $formattedDate = Carbon::parse($cashData->document_date)->format('Y-m-d');
        $year = Carbon::parse($cashData->document_date)->format('Y');
        $month = Carbon::parse($cashData->document_date)->format('m');

        return [
            'extdoc' => $procurement->id,
            'purchase_id' => $procurement->id,
            'code_transaction' => 'VEN',  // code_transaction
            'belnr' =>  $procurement->id, // belnr
            'company_code' => $settings['companyCode'],
            'gjahr' => $year, // gjahr
            'currency' => 'IDR', // waers
            'document_date' => $formattedDate, // bldat
            'budat' => $formattedDate, // budat
            'monat' => $month, // monat
            'reference' => $cashData->reference,  // xblnr
            'document_header_text' => $cashData->document_header_text, // bktxt
            'vendor_code' => $vendor->masterBusinesPartnerss->partner_number,  // lifnr
            'saknr' => '', //saknr
            'hkont' => '', //hkont
            'amount_local_currency' => $item->total_amount, //dmbtr
            'tax_code' => $item->tax,
            'dzfbdt' => '', //dzfbdt
            'assigment' => $reqno,
            'text' => 'DP ' . $item->tax . ' ' . $cashData->text,
            'profit_center' => $item->cost_center,
            'tax_amount' => $taxAmount,
            'amount' => $item->total_amount,
        ];
    }
}
