<?php

namespace Modules\Master\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Master\Models\MasterCostCenter;

class MasterCostCenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MasterCostCenter::create([
            "controlling_area" => "1600",
            "controlling_name" => "ME Indonesia",
            "cost_center" => "0000000101",
            "valid_form" => "20230101",
            "valid_to" => "99991201",
            "company_code" => "1600",
            "company_name" => "ME INDONESIA",
            "desc" => "Compliance and Internal Control",
            "standard_hierarchy_area" => "101",
            "short_desc_set" => "Deprec.Amortiz (long term)",
            "profile_center" => "0000000101",
            "long_text" => "Compliance and Internal Control",
        ]);
    }
}
