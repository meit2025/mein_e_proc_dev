<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\PurchaseRequisition\Database\Factories\PurchaseOrderFactory;

class PurchaseOrder extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'main_asset_number',
        'asset_subnumber',
        'order_number',
        'purchasing_document_number',
        'item_number_of_purchasing_document',
        'cost_center',
        'purchasing_document_date',
        'purchasing_document_type',
        'company_code',
        'purchasing_group',
        'purchasing_organization',
        'incoterms_part1',
        'incoterms_part2',
        'vendor_account_number',
        'currency_key',
        'terms_of_payment_key',
        'requisitioner_name',
        'purchase_requisition_number',
        'requirement_tracking_number',
        'item_number_of_purchase_requisition',
        'delivery_completed_indicator',
        'final_invoice_indicator',
        'account_assignment_category',
        'storage_location',
        'deletion_indicator',
        'material_group',
        'material_number',
        'po_unit_of_measure',
        'po_quantity',
        'tax_code',
        'net_price',
        'item_category',
        'invoice_receipt_indicator',
        'short_text',
        'gr_based_invoice_verification',
        'goods_receipt_indicator',
        'plant',
        'status',
        'code',
        'message',
        'attachment_link',
        'purchase_id',
        'loekz_cancel'
    ];

    // protected static function newFactory(): PurchaseOrderFactory
    // {
    //     // return PurchaseOrderFactory::new();
    // }
}
