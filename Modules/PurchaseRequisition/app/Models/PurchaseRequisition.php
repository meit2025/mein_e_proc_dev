<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\PurchaseRequisition\Database\Factories\PurchaseRequisitionFactory;

class PurchaseRequisition extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'requisitioner_name',
        'requisition_date',
        'purchase_requisition_number',
        'requirement_tracking_number',
        'item_number',
        'document_type',
        'valuation_type',
        'is_closed',
        'purchasing_group',
        'purchasing_organization',
        'account_assignment_category',
        'item_delivery_date',
        'storage_location',
        'desired_vendor',
        'material_group',
        'material_number',
        'unit_of_measure',
        'quantity',
        'tax_code',
        'item_category',
        'short_text',
        'plant',
        'deletion_indicator',
        'cost_center',
        'order_number',
        'asset_subnumber',
        'main_asset_number',
        'purchase_id', // Foreign key for relation

        'code_transaction',

        'header_not',
        'tanggal_entertainment',
        'tempat_entertainment',
        'alamat_entertainment',
        'jenis_entertainment',
        'nama_entertainment',
        'posisi_entertainment',
        'nama_perusahaan',
        'jenis_usaha_entertainment',
        'jenis_kegiatan_entertainment',
        'status',
        'code',
        'message',
        'attachment',
        'balance',
        'attachment_link'
    ];

    // Define the relationship with Purchase
    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }
}
