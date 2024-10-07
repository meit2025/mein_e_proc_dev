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
        // tabel sap BUT000
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

        // tabel sap LFA1
        'supplier_account_number',

        // tabel sap LFB1
        'reconciliation_account',
        'company_code',
        'payment_terms_credit_memos',
        'house_bank_short_key',
        'head_office_account_number',
        'central_deletion_flag',
        'double_invoice_check_flag',
        'tolerance_group',
        'payment_block_key',
        'sorting_assignment_key',
        'respected_payment_methods',

        // tabel sap LFB1
        'vendor_account_number',
        'purchasing_organization',
        'incoterms_part_1',
        'incoterms_part_2',
        'calculation_schema_group',
        'auto_po_allowed',
        'indicates_returns_supplier',
        'abc_indicator',
        'central_deletion_flag_master_record',
        'central_purchasing_block',
        'responsible_salesperson',
        'shipping_conditions',
        'currency_key',
        'gr_invoice_verification',
        'payment_terms_key',
    ];
}
