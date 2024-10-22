<?php

namespace Modules\Reimbuse\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Modules\Reimbuse\Models\ReimburseGroup;
use Modules\Reimbuse\Models\ReimburseProgress;
use Faker\Factory as Faker;
use Modules\Reimbuse\Models\Reimburse;

class ReimburseProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        ReimburseProgress::create(
            [
                "group"     =>  'Asal123',
                "approver"  =>  '23456',
                "notes"     =>  $faker->sentence(),
                "status"    =>  ['Approved', 'Rejected', 'Open'][rand(0, 2)]
            ]
        );
    }
}
