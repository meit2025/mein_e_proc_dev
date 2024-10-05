<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterBusinessPartnersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('master_business_partners')->insert([
            [
                'external_partner_number' => 'EX123456',
                'partner_grouping' => 'Group1',
                'search_term_one' => 'SearchTerm1',
                'search_term_two' => 'SearchTerm2',
                'name_one' => 'Name One',
                'name_two' => 'Name Two',
                'name_three' => 'Name Three',
                'name_four' => 'Name Four',
                'partner_number' => 'PN123456',
                'form_of_address_key' => 'Key1',
                'central_block' => 'Block1',
                'created_at' => now(),
                'updated_at' => now(),
                'supplier_account_number' => 'SA123456',
                'reconciliation_account' => 'RA123456',
                'company_code' => 'Company1',
                'payment_terms_credit_memos' => 'PT1',
                'house_bank_short_key' => 'HSK1',
                'head_office_account_number' => 'HO123456',
                'central_deletion_flag' => '0',
                'double_invoice_check_flag' => '0',
                'tolerance_group' => '-',
                'payment_block_key' => '-',
                'sorting_assignment_key' => '-',
                'respected_payment_methods' => '-',
                'vendor_account_number' => '-',
                'purchasing_organization' => '-',
                'incoterms_part_1' => '-',
                'incoterms_part_2' => '-',
                'calculation_schema_group' => '-',
                'auto_po_allowed' => 'N',
                'indicates_returns_supplier' => '0',
                'abc_indicator' => '-',
                'central_deletion_flag_master_record' => '0',
                'central_purchasing_block' => '0',
                'responsible_salesperson' => '-',
                'shipping_conditions' => '-',
                'currency_key' => '-',
                'gr_invoice_verification' => '0',
                'payment_terms_key' => '-',
            ],
        ]);
    }
}
