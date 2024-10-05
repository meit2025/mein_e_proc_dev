<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterBusinessPartnerAddressFactory;

class MasterBusinessPartnerAddress extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        // sap tabel BUT020
        'id',
        'address_number',
        'date_of_move',
        'validity_start',
        'validity_end',
        'external_address_number',
        'valid_from_date',
        'uuid_character_form',
        'move_target_address',
        'version_id',
        'partner_number',
        'is_standard_address'
    ];
}
