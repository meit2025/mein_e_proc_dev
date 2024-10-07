<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterBusinessPartnerTaxNumberFactory;

class MasterBusinessPartnerTaxNumber extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        // tabel sap DFKKBPTAXNUM
        'business_partner_number',
        'business_partner_tax_number',
        'tax_number_category',
    ];

    // protected static function newFactory(): MasterBusinessPartnerTaxNumberFactory
    // {
    //     // return MasterBusinessPartnerTaxNumberFactory::new();
    // }
}
