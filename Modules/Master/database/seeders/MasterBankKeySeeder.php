<?php

namespace Modules\Master\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Master\Models\MasterBankKey;

class MasterBankKeySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MasterBankKey::create([
            "region_key" => "ID",
            "bank_keys" => "0080017",
            "name_financial_institution" => "PT. BANK MANDIRI (PERSERO) TBK",
            "city" => "JAKARTA",
            "street_house_number" => "",
            "bank_branch" => "JAKARTA"
        ]);
    }
}
