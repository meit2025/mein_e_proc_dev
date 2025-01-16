<?php

namespace Modules\Master\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Master\Models\MasterOrder;

class MasterOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MasterOrder::create([
            "order_number" => "220000000000",
            "desc" => "Perbaikan Mesin Jet",
            "order_type" => "SM02",
            "short_text" => "Service Order with Contract",
            "company_code" => "1600",
            "company_name" => "ME INDONESIA",
            "profile_center" => "0000000321",
            "long_text" => "EDM Service",
        ]);
    }
}
