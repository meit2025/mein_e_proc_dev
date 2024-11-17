<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\PurchaseRequisition\Database\Factories\UnitFactory;

class Unit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'vendor_id',
        'cost_center',
        'material_group',
        'material_number',
        'uom',
        'qty',
        'unit_price',
        'total_amount',
        'tax',
        'short_text',
        'order_number',
        'asset_number',
        'sub_asset_number',
        'account_assignment_categories'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}
