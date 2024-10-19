<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\PurchaseRequisition\Database\Factories\ProcurementFactory;

class Procurement extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */

    protected $fillable = [
        'const_center',
        'cost_center_budgeted',
        'transaction_budgeted',
        'vendor_remark',
        'vendor_selected_competitive_lowest_price',
        'vendor_selected_competitive_price',
        'vendor_selected_competitive_capable',
        'selected_vendor_remark',
    ];

    public function vendors()
    {
        return $this->hasMany(Vendor::class);
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
