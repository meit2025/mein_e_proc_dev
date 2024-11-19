<?php

namespace Modules\Master\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Master\Models\MaterialGroup;

class MaterialGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MaterialGroup::create([
            "material_group" => "fufufafa",
            "material_group_desc" => "test doang"
        ]);
    }
}
