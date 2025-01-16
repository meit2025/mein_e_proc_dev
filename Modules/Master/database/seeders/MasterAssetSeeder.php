<?php

namespace Modules\Master\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Master\Models\MasterAsset;

class MasterAssetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MasterAsset::create([
            "company_code" => "1600",
            "company_name" => "ME INDONESIA",
            "asset" => "203000000000",
            "asset_subnumber" => "0000",
            "asset_class" => "00203000",
            "asset_class_desc" => "Office Equipment",
            "desc" => "01-0001",
            "inventory_number" => "Test Asset",
            "qty" => 2000,
            "base_unit_of_measure" => "ST"
        ]);
    }
}
