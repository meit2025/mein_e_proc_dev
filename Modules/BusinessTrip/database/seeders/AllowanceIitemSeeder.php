<?php

namespace Modules\BusinessTrip\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Modules\BusinessTrip\Models\AllowanceItem;

class AllowanceIitemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $this->call([]);

        DB::table('allowance_items')->truncate();
        
        $data = [
            [
                "type" => "TOTAL",
                "fixed_value" => null,
                "max_value" => null,
                "request_value" => "unlimited",
                "formula" => "sum()",
                "currency_id" => "IDR",
                "allowance_category_id" => "1",
                "code" =>"GASOLINE",
                "name" => "Gasoline Total"
            ],
            [
                "type" => "DAILY",
                "fixed_value" =>null,
                "max_value" => null,
                "request_value" => "unlimited",
                "formula" => "sum()",
                "currency_id" => "IDR",
                "allowance_category_id" => "2",
                "code" => "MEALSECTORBREAKFAST",
                "name" => "BREAKFAST A SECTOR DOMESTIC"
            ]
        ];

        AllowanceItem::insert($data);
    }
}
