<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterBusinessPartnerFactory;

class MasterBusinessPartner extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'external_partner_number',
        'partner_grouping',
        'search_term_one',
        'search_term_two',
        'name_one',
        'name_two',
        'name_three',
        'name_four',
        'partner_number',
        'form_of_address_key',
        'central_block',
    ];

    // Relasi dengan Business Partner Address
    public function addresses()
    {
        return $this->hasMany(MasterBusinessPartnerAddress::class, 'partner_number', 'external_partner_number');
    }
    // Relasi dengan Business Partner Bank Details melalui external_partner_number
    public function bankDetails()
    {
        return $this->hasMany(MasterBusinessPartnerAddress::class, 'partner_number', 'external_partner_number');
    }

    public function addressDetails()
    {
        return $this->hasOne(MasterBusinessPartnerAddress::class, 'partner_number', 'external_partner_number');
    }
}
