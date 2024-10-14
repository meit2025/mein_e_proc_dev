<?php

namespace Modules\Reimbuse\Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Modules\Reimbuse\Models\ReimbursePeriod;
use Modules\Reimbuse\Models\ReimburseQuota;
use Modules\Reimbuse\Models\ReimburseType;

class ReimburseQuotaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $stt = ['A', 'B', 'C', 'D', 'E'];
        for ($i = 0; $i < 10; $i++) {
            ReimburseQuota::create([
                'period'    =>  ReimbursePeriod::inRandomOrder()->first()->code,
                'type'      =>  ReimburseType::inRandomOrder()->first()->code,
                'grade'     =>  $stt[rand(0, count($stt) - 1)],
                'plafon'    =>  $faker->randomFloat(2, 100000, 10000000),
                'limit'     =>  $faker->randomDigit()
            ]);
        }
    }
}
