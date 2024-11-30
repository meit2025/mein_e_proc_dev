<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\PurchaseRequisition\Database\Factories\CashAdvancePurchasesFactory;

class CashAdvancePurchases extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'cascade',
        'reference',
        'document_header_text',
        'document_date',
        'due_on',
        'text',
        'purchase_id',
        'dp',
        'unit_id'
    ];
    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'id');
    }
}
