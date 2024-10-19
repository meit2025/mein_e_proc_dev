<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\PurchaseRequisition\Database\Factories\VendorFactory;

class Vendor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'procurement_id',
        'vendor',
        'vendor_winner',
    ];

    public function procurement()
    {
        return $this->belongsTo(Procurement::class);
    }

    public function units()
    {
        return $this->hasMany(VendorUnit::class);
    }
}
