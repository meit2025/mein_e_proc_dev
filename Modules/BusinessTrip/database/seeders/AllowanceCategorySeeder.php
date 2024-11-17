<?php

namespace Modules\BusinessTrip\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Modules\BusinessTrip\Models\AllowanceCategory;

class AllowanceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $this->call([]);


        DB::table('allowance_categories')->truncate();
        $data = [
            [
                'code'=> 'LOCAL',
                'name' => 'Local Trip'
            ],
            [
                'code' => 'MEAL',
                'name' => 'Meal Allowance'
            ],
            [
                'code' => 'Other',
                'name' => 'Other Allowance'
            ],
            [
                'code' => 'POCKET',
                'name' => 'Pocket Money'
            ],
        ];

        AllowanceCategory::insert($data);
    }
}
