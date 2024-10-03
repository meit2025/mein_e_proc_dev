<?php

namespace Modules\Reimbuse\Database\Seeders;

use App\Models\Currency;
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
        for ($i = 0; $i < 10; $i++) {
            Reimburse::insert(
                [
                    "rn"            =>  $faker->unique()->unixTime(),
                    "group"         =>  ReimburseGroup::inRandomOrder()->first()->code,
                    "type"          =>  ReimburseType::inRandomOrder()->first()->code,
                    "requester"     =>  User::inRandomOrder()->first()->nip,
                    "remark"        =>  $faker->sentence(),
                    "balance"       =>  $faker->randomFloat(2, 100000, 1000000),
                    "receipt_date"  =>  $faker->date(),
                    "start_date"    =>  $faker->date(),
                    "end_date"      =>  $faker->date($format = 'Y-m-d', $max = '+3 days'),
                    "period"        =>  ReimbursePeriod::inRandomOrder()->first()->code,
                    "currency"      =>  Currency::inRandomOrder()->first()->code
                ]
            );
        }
    }
}
