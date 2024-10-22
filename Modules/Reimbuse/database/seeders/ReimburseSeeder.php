<?php

namespace Modules\Reimbuse\Database\Seeders;

use App\Models\Currency;
use App\Models\Family;
use App\Models\User;
use Illuminate\Database\Seeder;
use Modules\Reimbuse\Models\Reimburse;
use Faker\Factory as Faker;
use Modules\Reimbuse\Models\ReimburseGroup;
use Modules\Reimbuse\Models\ReimbursePeriod;
use Modules\Reimbuse\Models\ReimburseType;

class ReimburseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        Reimburse::insert(
            [
                [
                    "group"         =>  'Asal123',
                    "type"          =>  'PS1',
                    "currency"      =>  Currency::inRandomOrder()->first()->code,
                    "remark"        =>  $faker->sentence(),
                    "for"           =>  '1',
                    "balance"       =>  25000,
                    "receipt_date"  =>  $faker->date(),
                    "start_date"    =>  $faker->date(),
                    "end_date"      =>  $faker->date($format = 'Y-m-d', $max = '+3 days'),
                    "period"        =>  'pd-01',
                ],
                [
                    "group"         =>  'Asal123',
                    "type"          =>  'IB1',
                    "currency"      =>  Currency::inRandomOrder()->first()->code,
                    "remark"        =>  $faker->sentence(),
                    "for"           =>  '2',
                    "balance"       =>  25000,
                    "receipt_date"  =>  $faker->date(),
                    "start_date"    =>  $faker->date(),
                    "end_date"      =>  $faker->date($format = 'Y-m-d', $max = '+3 days'),
                    "period"        =>  'pd-01',
                ],
                [
                    "group"         =>  'Asal123',
                    "type"          =>  'IB2',
                    "currency"      =>  Currency::inRandomOrder()->first()->code,
                    "remark"        =>  $faker->sentence(),
                    "for"           =>  '12345',
                    "balance"       =>  25000,
                    "receipt_date"  =>  $faker->date(),
                    "start_date"    =>  $faker->date(),
                    "end_date"      =>  $faker->date($format = 'Y-m-d', $max = '+3 days'),
                    "period"        =>  'pd-01',
                ]
            ]
        );
    }
}
