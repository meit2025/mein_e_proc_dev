<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Master\Models\MasterBusinessPartner;

// use Modules\PurchaseRequisition\Database\Factories\VendorFactory;

class Vendor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'purchase_id',
        'vendor',
        'winner',
        'vendor_name_text',
        'type_vendor',
    ];

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function masterBusinesPartnerss()
    {
        return $this->hasOne(MasterBusinessPartner::class,  'id', 'vendor');
    }

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }
}
