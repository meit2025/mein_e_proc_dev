<?php

namespace Modules\PurchaseRequisition\Services;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Modules\PurchaseRequisition\Models\CashAdvance;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;

class TextPrServices
{
    public function processTextData($id, $code)
    {
        DB::beginTransaction();
        try {

            $pr = PurchaseRequisition::where('purchase_id', $id)->where('code_transaction', $code)->get();
            $CashAdvance = CashAdvance::where('purchase_id', $id)->where('code_transaction', $code)->get();
            $array = [];
            $arrayCash = [];
            $reqno = '';
            foreach ($pr as $key => $value) {
                $datainsert = $this->preparePurchaseRequisitionData($value);
                $reqno = $value->purchase_requisition_number;
                $array[] = $datainsert;
            }

            foreach ($CashAdvance as $key => $ca) {
                # code...
                $dataCash = $this->prepareCashAdvanceData($ca);
                $arrayCash[] = $dataCash;
            }

            $generate = $this->generateFiles($array, $arrayCash, $reqno);

            DB::commit();
            return $generate;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception($e->getMessage());
        }
    }

    private function preparePurchaseRequisitionData($pr)
    {
        $pg =  explode("-", $pr->purchasing_group);
        return [
            'code_transaction' => $pr->code_transaction, // code_transaction
            'purchase_requisition_number' => $pr->purchase_requisition_number, // banfn
            'item_number' => $pr->item_number, //bnfpo
            'requisitioner_name' => $pr->requisitioner_name, // afnam
            'requisition_date' => $pr->requisition_date, // badat
            'requirement_tracking_number' => $pr->requirement_tracking_number, // bednr
            'document_type' => $pr->document_type, //bsart
            'valuation_type' => $pr->valuation_type, //bwtar
            'is_closed' => $pr->is_closed, // ebakz
            'purchasing_group' => count($pg) > 0 ? $pg[0] : '', // perlu input // ekgrp
            'purchasing_organization' => $pr->purchasing_organization, // ekorg
            'account_assignment_category' => $pr->account_assignment_category, // knttp
            'item_delivery_date' => $pr->item_delivery_date, // lfdat
            'storage_location' => $pr->storage_location, // lgort
            'desired_vendor' => $pr->desired_vendor, // lifnr
            'material_group' => $pr->material_group, // matkl
            'material_number' => $pr->material_number, // matnr
            'unit_of_measure' => $pr->unit_of_measure, // meins
            'quantity' => $pr->quantity, // menge
            'balance' => $pr->balance, // NILAI NYA//netpr
            'waers' => 'IDR', // MATA UANG
            'tax_code' => $pr->tax_code, // mwskz
            'item_category' => $pr->item_category, // pstyp
            'short_text' => $pr->short_text, // txz01
            'plant' => $pr->plant, // werks
            'cost_center' => $pr->cost_center, // kostl
            'order_number' => $pr->order_number, // AUFNR
            'asset_subnumber' => $pr->asset_subnumber, // anln2
            'main_asset_number' => $pr->main_asset_number, // anln1
            'tanggal_entertainment' => $pr->tanggal_entertainment, // b81
            'tempat_entertainment' => $pr->tempat_entertainment,
            'alamat_entertainment' => $pr->alamat_entertainment,
            'jenis_entertainment' => $pr->jenis_entertainment,
            'nama_entertainment' => $pr->nama_entertainment,
            'posisi_entertainment' => $pr->posisi_entertainment,
            'nama_perusahaan' => $pr->nama_perusahaan,
            'jenis_usaha_entertainment' => $pr->jenis_usaha_entertainment,
            'jenis_kegiatan_entertainment' => $pr->jenis_kegiatan_entertainment,
            'header_not' => $pr->header_not, // b01
            'B01' => $pr->short_text,
            'B03' => $pr->short_text,
            'B04' => $pr->short_text,
            'attachment_link' => $pr->attachment_link,
        ];
    }

    private function prepareCashAdvanceData($ca)
    {


        return [
            'code_transaction' => $ca->code_transaction,
            'belnr' => $ca->belnr, // belnr
            'company_code' => $ca->company_code, // bukrs
            'gjahr' =>  '', // gjahr ini year
            'currency' => 'IDR', // waers
            'document_date' => $ca->document_date, // bldat
            'budat' => $ca->budat, // budat
            'monat' => $ca->monat, // monat
            'reference' => $ca->reference, // xblnr
            'document_header_text' => $ca->document_header_text, // bktxt
            'vendor_code' => $ca->vendor_code ?? '', // lifnr
            'saknr' => '', //saknr
            'hkont' => '', //hkont
            'amount_local_currency' => $ca->amount_local_currency, // dmbtr
            'tax_code' => $ca->tax_code, // mwskz
            'zfbdt' => $ca->document_date, //zfbdt
            'purchasing_document' => '', //ebeln
            'purchasing_document_item' => '', //ebelp
            'assigment' => $ca->assigment, // zuonr
            'text' => $ca->text, // sgtxt
            'profit_center' => $ca->profit_center, // prctr
            'tax_amount' => $ca->tax_amount, // wmwst
        ];
    }

    private function generateFiles($array, $arrayCash, $nopr)
    {
        try {
            //code...
            $timestamp = date('Ymd_His');

            // Generate Purchase Requisition File
            $filename = 'INB_PRCRT_' . $nopr . '_' . $timestamp . '.txt';
            $fileContent = $this->convertArrayToFileContent($array);
            Log::channel('send_txt')->info('Send txt name ' . $filename . ' storage upload ' . env('STORAGE_UPLOAD', 'local'));
            Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($filename, $fileContent);
            Storage::disk('local')->put($filename, $fileContent);

            $filenameAc = '';
            // Generate Cash Advance File (if applicable)
            if (!empty($arrayCash)) {
                $filenameAc = 'INB_DPCRT_' . $nopr . '_' . $timestamp . '.txt';
                $fileContentAc = $this->convertArrayToFileContent($arrayCash);

                Log::channel('send_txt')->info('Send txt name ' . $filenameAc . ' storage upload ' . env('STORAGE_UPLOAD', 'local'));
                Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($filenameAc, $fileContentAc);
                Storage::disk('local')->put($filenameAc, $fileContentAc);
            }

            return [
                'filename' => $filename,
                'filenameAc' => $filenameAc,
            ];
        } catch (\Throwable $th) {
            //throw $th;
            dd($th);
        }
    }

    private function convertArrayToFileContent($array)
    {
        return implode(PHP_EOL, array_map(fn($item) => implode("|", $item), $array)) . PHP_EOL;
    }
}
