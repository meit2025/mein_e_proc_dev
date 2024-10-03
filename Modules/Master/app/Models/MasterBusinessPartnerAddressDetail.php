<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterBusinessPartnerAddressDetailFactory;

class MasterBusinessPartnerAddressDetail extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'building',
        'city',
        'district',
        'country_key',
        'fax_extension',
        'fax_number',
        'floor',
        'postal_city',
        'language_key',
        'street_five',
        'co_name',
        'postal_code',
        'po_box_postal_code',
        'company_postal_code',
        'po_box',
        'region',
        'room_number',
        'street',
        'street_two',
        'street_three',
        'street_four',
        'phone_extension',
        'phone_number',
        'email',
        'communication_valid_from',
        'communication_valid_to',
        'partner_number',
    ];
    public function businessPartner()
    {
        return $this->belongsTo(MasterBusinessPartnerAddress::class, 'partner_number', 'external_partner_number');
    }
}
