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
    public function processTextData($id)
    {
        DB::beginTransaction();
        try {
            // Fetch necessary data
            $reim = $this->findReimburse($id);
            $businessPartner = $this->getBusinessPartner($reim->requester);
            $user = User::where('nip', $reim->requester)->first();
            if (!$user) {
                Log::channel('reim_txt')->info('User not found for requester: ' . $reim->requester);
                throw new Exception('User not found for requester: ' . $reim->requester);
            }
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
                $data = $this->preparePurchaseRequisitionData([
                    'reim' => $reim,
                    'dokumenType' => $dokumenType,
                    'reqno' => $reqno,
                    'value' => $value,
                    'businessPartner' => $businessPartner,
                    'PurchasingOrganization' => $settings['PurchasingOrganization'],
                    'AccountAssignmentCategory' => $settings['AccountAssignmentCategory'],
                    'StorageLocation' => $settings['StorageLocation'],
                    'PurchaseRequisitionQuantity' => $settings['PurchaseRequisitionQuantity'],
                    'plant' => $settings['plant'],
                    'user' => $user
                ]);

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
        $reim = Reimburse::with('reimburseType')->where('group', $code)->get();
        // dd($reim);
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

    private function preparePurchaseRequisitionData(array $params)
    {
        $reim = $params['reim'];
        $dokumenType = $params['dokumenType'];
        $reqno = $params['reqno'];
        $value = $params['value'];
        $businessPartner = $params['businessPartner'];
        $PurchasingOrganization = $params['PurchasingOrganization'];
        $AccountAssignmentCategory = $params['AccountAssignmentCategory'];
        $StorageLocation = $params['StorageLocation'];
        $PurchaseRequisitionQuantity = $params['PurchaseRequisitionQuantity'];
        $plant = $params['plant'];
        $user = $params['user'];

        $formattedDate = Carbon::parse($reim->created_at)->format('Y-m-d');
        $attachment = $this->findReimburseAttachment($value->id);
        $reimburseType = $this->findReimburseType($value->reimburse_type);
        $materialNumber = MasterMaterial::find($reimburseType->material_number);
        $materialGroup = MaterialGroup::find($reimburseType->material_group);
        $pajak = Pajak::find($value->tax_on_sales);
        $purchasingGroup = PurchasingGroup::find($value->purchasing_group);
        $uom = Uom::find($value->purchase_requisition_unit_of_measure);

        $costCenter = MasterCostCenter::where('id', $reim->cost_center)->first();

        // generate txt
        // $destinationShort = substr($value->reimburseType->name, 0, 10);
        // $wordrequestFors = explode(' ', $user->name);
        // $userName = $wordrequestFors[0] ?? 'Unknown User';
        // $businessTripStartDateFormatted = date("Md", strtotime($value->claim_date));

        // $shortText = strtoupper("{$destinationShort}-{$userName}-{$businessTripStartDateFormatted}");


        // $headerNote = "Remark Item: {$value->short_text} - Remark header: {$reim->remark}";

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
            'short_text' => $value->short_text,  // txz01
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
            'header_not' =>   $reim->remark, // b01
            'B01' => '',
            'B03' => '',
            'B04' => '',
            'attachment_link' => $attachment,
        ];
    }
}
