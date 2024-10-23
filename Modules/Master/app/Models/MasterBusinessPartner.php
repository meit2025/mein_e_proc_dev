<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterBusinessPartnerFactory;

class MasterBusinessPartner extends Model
{
    use HasFactory;


    // BUTOOO (MasterBusinessPartner)
    // BUT020 (MasterBusinessPartnerAddress)
    // ADRC (MasterBusinessPartnerAddressDetail)
    // ADR6 (MasterBusinessPartnerAddressDetail)
    // BUT021_FS (MasterBusinessPartnerAddressNumber)
    // DFKKBPTAXNUM (MasterBusinessPartnerTaxNumber)
    // LFA1 (MasterBusinessPartner)
    // LFB1 (MasterBusinessPartner)
    // LFM1 (MasterBusinessPartner)

    // BUT000	BUT020	1:N
    // BUT000	BUT0BK	1:N
    // BUT020	ADRC	1:1
    // ADRC	    ADR6	1:1
    // BUT000	BUT021_FS	1:N
    // BUT000	DFKKBPTAXNUM	1:N
    // BUT000	LFA1	1:1
    // BUT000	LFB1	1:1
    // BUT000	LFM1	1:1

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'external_partner_number',
        'partner_grouping',
        'search_term_one',
        'name_one',
        'partner_number',
        'central_block',
        'city',
        'country',
        'postal_code',
        'tax_number',
        'number_supplier',
        'delete',
        'purchasing_block',
        'type',
    ];

    public function employee()
    {
        return $this->belongsTo(MasterBusinessPartner::class, 'master_business_partner_id', 'id');
    }
}
