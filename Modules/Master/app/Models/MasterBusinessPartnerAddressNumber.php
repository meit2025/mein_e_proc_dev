<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterBusinessPartnerAddressNumberFactory;

class MasterBusinessPartnerAddressNumber extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        // sap number BUT021_FS
        'address_number',
        'address_type',
        'business_partner_number',
        'valid_to',
        'indicator_standard',
    ];

    // protected static function newFactory(): MasterBusinessPartnerAddressNumberFactory
    // {
    //     // return MasterBusinessPartnerAddressNumberFactory::new();
    // }
}
