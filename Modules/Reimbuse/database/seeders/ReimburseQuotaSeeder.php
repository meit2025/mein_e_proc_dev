<?php

namespace Modules\Reimbuse\Database\Seeders;

use App\Models\Grade;
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
        // $faker = Faker::create();
        // $stt = Grade::count();
        // for ($i = 0; $i < $stt; $i++) {
        //     for ($j = 1; $j < rand(2, 7); $j++) {
        //         ReimburseQuota::create([
        //             'period'    =>  ReimbursePeriod::inRandomOrder()->first()->code,
        //             'type'      =>  ReimburseType::inRandomOrder()->first()->code,
        //             'grade'     =>  rand(1, $stt),
        //             'plafon'    =>  $faker->randomFloat(2, 100000, 10000000),
        //             'limit'     =>  $faker->randomDigit()
        //         ]);
        //     }
        // }
        ReimburseQuota::insert([
            [
                'period'    =>  'pd-01',
                'type'      =>  'PS1',
                'grade'     =>  1,
                'plafon'    =>  100000,
                'limit'     =>  1
            ],
            [
                'period'    =>  'pd-01',
                'type'      =>  'IB1',
                'grade'     =>  1,
                'plafon'    =>  100000,
                'limit'     =>  1
            ],
            [
                'period'    =>  'pd-01',
                'type'      =>  'IB2',
                'grade'     =>  1,
                'plafon'    =>  100000,
                'limit'     =>  1
            ],
        ]);
    }
}
