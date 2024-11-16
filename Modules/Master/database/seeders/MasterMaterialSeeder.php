<?php

namespace Modules\Master\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Master\Models\MasterMaterial;

class MasterMaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MasterMaterial::create([
            "old_material_number"   =>  "MYN1200",
            "external_material_group"   =>  "ID01",
            "material_group"    =>  "M",
            "material_number"   =>  "HAWA",
            "industry"  =>  "ST",
            "base_unit_of_measure"  =>  "F020 3M",
            "material_type" =>  "",
            "material_description"  =>  "",
            "plant_specific_material_status"    =>  "NC_SRVC",
            "material_status_valid"  =>  "",
            "plant"    =>  "NC_SRVC",
        ]);
    }
}
