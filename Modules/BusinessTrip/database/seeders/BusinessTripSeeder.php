<?php

namespace Modules\BusinessTrip\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\BusinessTrip\Models\AllowanceCategory;
use Modules\BusinessTrip\Models\AllowanceItem;

class BusinessTripSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $this->call([])
        
        $this->call([AllowanceIitemSeeder::class, AllowanceCategorySeeder::class, PurposeTypeSeeder::class]);
    }
}
