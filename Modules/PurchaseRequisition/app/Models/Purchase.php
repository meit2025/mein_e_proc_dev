<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\PurchaseRequisition\Database\Factories\PurchaseFactory;

class Purchase extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */

    protected $fillable = [
        'user_id',
        'document_type',
        'purchasing_groups',
        'account_assignment_categories',
        'delivery_date',
        'storage_locations',
        'total_vendor',
        'total_item',
        'is_cashAdvance'
    ];

    public function getCreatedAtFormattedAttribute()
    {
        return $this->created_at->format('y-m-d'); // Format as DD.MM.YY
    }
    public function getDeliveryDateFormattedAttribute()
    {
        return $this->created_at->format('y-m-d'); // Format as DD.MM.YY
    }

    public function vendors()
    {
        return $this->hasMany(Vendor::class);
    }
    public function purchaseRequisitions()
    {
        return $this->hasMany(PurchaseRequisition::class);
    }

    public function entertainment()
    {
        return $this->hasOne(Entertainment::class);
    }
    public function cashAdvancePurchases()
    {
        return $this->hasOne(CashAdvancePurchases::class);
    }
}
