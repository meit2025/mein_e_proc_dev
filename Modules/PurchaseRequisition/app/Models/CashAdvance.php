<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\PurchaseRequisition\Database\Factories\CashAdvanceFactory;

class CashAdvance extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'purchase_id',
        'company_code',
        'document_type',
        'currency',
        'document_date',
        'reference',
        'document_header_text',
        'item',
        'posting_key',
        'gl_indicator',
        'target_spesial',
        'vendor_code',
        'amount',
        'amount_local_currency',
        'tax_amount',
        'tax_code',
        'due_on',
        'payment_method',
        'purchasing_document',
        'purchasing_document_item',
        'assigment',
        'text',
        'profit_center',
        'gjahr',
        'budat',
        'monat',
    ];


    // protected static function newFactory(): CashAdvanceFactory
    // {
    //     // return CashAdvanceFactory::new();
    // }
}
