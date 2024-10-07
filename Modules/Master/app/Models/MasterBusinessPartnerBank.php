<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterBusinessPartnerBankFactory;

class MasterBusinessPartnerBank extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        // sap tabel BUT0BK
        'id',
        'is_standard_address',
        'bank_key',
        'bank_account_number',
        'bank_country_key',
        'external_bank_details_id',
        'bank_control_key',
        'reference_details',
        'bank_details_id',
        'validity_start',
        'validity_end',
        'dummy_function',
        'bank_account_check_digit',
        'iban',
        'account_holder_name',
        'collection_authorization',
        'partner_number',
    ];

    // Relasi dengan Business Partner melalui partner_number
    public function businessPartner()
    {
        return $this->belongsTo(MasterBusinessPartnerAddress::class, 'partner_number', 'external_partner_number');
    }
}
