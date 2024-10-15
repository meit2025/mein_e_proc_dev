<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\PurchaseRequisition\Database\Factories\VendorUnitFactory;

class VendorUnit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'vendor_id',
        'unit_price',
        'total_amount',
        'other_criteria',
    ];

    public function vendors()
    {
        return $this->belongsTo(Vendor::class);
    }
}
