<?php

namespace Modules\PurchaseRequisition\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use Modules\Approval\Models\SettingApproval;
use Modules\Master\Models\MasterBusinessPartner;
use Modules\Master\Models\MasterCostCenter;
use Modules\Master\Models\MasterMaterial;
use Modules\Master\Models\MasterTypeReimburse;
use Modules\Master\Models\MaterialGroup;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\PurchasingGroup;
use Modules\Master\Models\Uom;
use Modules\PurchaseRequisition\Models\CashAdvance;
use Modules\PurchaseRequisition\Models\CashAdvancePurchases;
use Modules\PurchaseRequisition\Models\Entertainment;
use Modules\PurchaseRequisition\Models\Purchase;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;
use Modules\PurchaseRequisition\Models\Unit;
use Modules\PurchaseRequisition\Models\Vendor;
use Modules\Reimbuse\Models\Reimburse;
use Modules\Reimbuse\Models\ReimburseAttachment;
use Modules\Reimbuse\Models\ReimburseGroup;

class ReimburseServices
{
    // public function processTextData($id)
    // {
    //     DB::beginTransaction();
    //     try {
    //         $reim = $this->findReimburse($id);
    //         $businessPartner = $this->getBusinessPartner($reim->requester);
    //         $reimData = $this->findReimburseData($reim->code);

    //         $array = [];
    //         $dokumenType = SettingApproval::where('key', 'dokumenType_reimburse')->first()->value;
    //         $PurchasingOrganization = SettingApproval::where('key', 'PurchasingOrganization')->first()->value;
    //         $AccountAssignmentCategory = SettingApproval::where('key', 'AccountAssignmentCategory')->first()->value;
    //         $StorageLocation = SettingApproval::where('key', 'StorageLocation')->first()->value;
    //         $PurchaseRequisitionQuantity = SettingApproval::where('key', 'PurchaseRequisitionQuantity')->first()->value;
    //         $plant = SettingApproval::where('key', 'plant')->first()->value;
    //         $latestRequisition = SettingApproval::where('key', 'dokumenType_' . $dokumenType)->lockForUpdate()->first();

    //         $reqno = $latestRequisition ? (int) $latestRequisition->value + 1 : 0;

    //         foreach ($reimData as $key => $value) {
    //             $datainsert = $this->preparePurchaseRequisitionData($key + 1, $reim, $dokumenType, $reqno, $value, $businessPartner, $PurchasingOrganization, $AccountAssignmentCategory, $StorageLocation, $PurchaseRequisitionQuantity, $plant);
    //             $array[] = $datainsert;
    //             PurchaseRequisition::create($datainsert);
    //         }

    //         $latestRequisition->update([
    //             'value' => $reqno
    //         ]);

    //         DB::commit();
    //         return $array;
    //     } catch (Exception $e) {
    //         DB::rollBack();
    //         Log::channel('reim_txt')->info($e->getMessage());
    //         dd($e);
    //         throw new Exception($e->getMessage());
    //     }
    // }

    public function processTextData($id)
    {
        DB::beginTransaction();
        try {
            // Fetch necessary data
            $reim = $this->findReimburse($id);
            $businessPartner = $this->getBusinessPartner($reim->requester);
            $reimData = $this->findReimburseData($reim->code);

            // Collect SettingApproval values
            $settings = SettingApproval::whereIn('key', [
                'dokumenType_reimburse',
                'PurchasingOrganization',
                'AccountAssignmentCategory',
                'StorageLocation',
                'PurchaseRequisitionQuantity',
                'plant'
            ])->pluck('value', 'key');

            $dokumenType = $settings['dokumenType_reimburse'];
            $reqno = (int) SettingApproval::where('key', 'dokumenType_' . $dokumenType)->lockForUpdate()->value('value') + 1;

            // Insert Purchase Requisition data
            $array = [];
            foreach ($reimData as $key => $value) {
                $data = $this->preparePurchaseRequisitionData(
                    $key + 1,
                    $reim,
                    $dokumenType,
                    $reqno,
                    $value,
                    $businessPartner,
                    $settings['PurchasingOrganization'],
                    $settings['AccountAssignmentCategory'],
                    $settings['StorageLocation'],
                    $settings['PurchaseRequisitionQuantity'],
                    $settings['plant']
                );

                $array[] = $data;
                PurchaseRequisition::create($data);
            }

            // Update latest requisition value
            SettingApproval::where('key', 'dokumenType_' . $dokumenType)->update(['value' => $reqno]);

            DB::commit();
            return $array;
        } catch (Exception $e) {
            DB::rollBack();
            Log::channel('reim_txt')->error($e->getMessage(), ['id' => $id]);
            throw $e;
        }
    }

    private function findReimburse($id)
    {
        $procurement = ReimburseGroup::find($id);
        if (!$procurement) {
            Log::channel('reim_txt')->info('Reim not found.');
            throw new Exception('Reim not found');
        }
        return $procurement;
    }

    private function findReimburseData($code)
    {
        $reim = Reimburse::where('group', $code)->get();
        return $reim;
    }
    private function findReimburseAttachment($id)
    {
        $reim = ReimburseAttachment::where('reimburse', $id)->get();
        $attachmentString = $reim->map(function ($attachment, $index) {
            $rowNumber = str_pad($index + 1, 2, '0', STR_PAD_LEFT); // Format row number to 2 digits
            $title = "reimburs_$rowNumber";
            $url =   url("storage/reimburse_attachments/{$attachment->url}");

            return "{$title};{$url}";
        })->implode('$');
        return $attachmentString;
    }
    private function findReimburseType($code)
    {
        $reim = MasterTypeReimburse::where('code', $code)->first();
        return $reim;
    }

    private function getBusinessPartner($userId)
    {
        $user = User::where('nip', $userId)->first();
        if ($user && $user->master_business_partner_id) {
            $businessPartner = MasterBusinessPartner::find($user->master_business_partner_id);
            if (!$businessPartner) {
                Log::channel('reim_txt')->info('Business partner not found.');
                throw new Exception('Business partner not found');
            }
            return $businessPartner;
        }
        return null;
    }

    private function preparePurchaseRequisitionData($index, $reim, $dokumenType, $reqno, $value, $businessPartner, $PurchasingOrganization, $AccountAssignmentCategory, $StorageLocation, $PurchaseRequisitionQuantity, $plant)
    {
        $formattedDate = Carbon::parse($reim->created_at)->format('Y-m-d');
        $attachment = $this->findReimburseAttachment($value->id);
        $reimburseType = $this->findReimburseType($value->reimburse_type);
        $materialNumber = MasterMaterial::find($reimburseType->material_number);
        $materialGroup = MaterialGroup::find($reimburseType->material_group);
        $pajak = Pajak::find($value->tax_on_sales);
        $purchasingGroup = PurchasingGroup::find($value->purchasing_group);
        $uom = Uom::find($value->purchase_requisition_unit_of_measure);

        $costCenter = MasterCostCenter::where('id', $reim->cost_center)->first();

        return [
            'purchase_id' => $reim->id,
            'code_transaction' => 'REIM', // code_transaction
            'purchase_requisition_number' => $reqno, //banfn
            'item_number' => $value->item_number,  // bnfpo
            'requisitioner_name' => $businessPartner ? $businessPartner->partner_number : '', // afnam
            'requisition_date' => $formattedDate,  // badat
            'requirement_tracking_number' => '', // bednr
            'document_type' => $dokumenType, // bsart
            'valuation_type' => '', //bwtar
            'is_closed' => '', // ebakz
            'purchasing_group' => $purchasingGroup->purchasing_group, //bsart
            'purchasing_organization' => $PurchasingOrganization, // ekorg
            'account_assignment_category' => $AccountAssignmentCategory,  // knttp
            'item_delivery_date' => $formattedDate, // lfdat
            'storage_location' => $StorageLocation,  // lgort
            'desired_vendor' => $businessPartner->partner_number ?? '',  // lifnr
            'material_group' => $materialGroup->material_group, // matkl
            'material_number' => $materialNumber->material_number, // matnr
            'unit_of_measure' => $uom->commercial ?? '', // meins
            'quantity' => $PurchaseRequisitionQuantity,
            'balance' => $value->balance, //netpr
            'waers' => 'IDR',
            'tax_code' => $pajak->mwszkz, // mwskz
            'item_category' => '', // pstyp
            'short_text' => $reim->short_text,  // txz01
            'plant' => $plant, // werks
            'cost_center' => $costCenter->cost_center,  // kostl
            'order_number' => '', // AUFNR
            'asset_subnumber' => '',  // anln2
            'main_asset_number' => '',  // anln1
            'tanggal_entertainment' =>  '',  // b81
            'tempat_entertainment' =>  '',  // b83
            'alamat_entertainment' =>  '',
            'jenis_entertainment' =>  '',
            'nama_entertainment' =>  '',
            'posisi_entertainment' =>  '',
            'nama_perusahaan' => '',
            'jenis_usaha_entertainment' =>  '',
            'jenis_kegiatan_entertainment' =>  '', // b89
            'header_not' =>  '', // b01
            'B01' => '',
            'B03' => '',
            'B04' => '',
            'attachment_link' => $attachment,
        ];
    }
}
