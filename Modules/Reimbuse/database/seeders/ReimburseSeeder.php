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
        for ($i = 0; $i < 10; $i++) {
            $group = ReimburseGroup::inRandomOrder()->first()->code;
            $user = ReimburseGroup::where('code', $group)->first()->requester;
            Reimburse::insert(
                [
                    "group"         =>  $group,
                    "type"          =>  ReimburseType::inRandomOrder()->first()->code,
                    "currency"      =>  Currency::inRandomOrder()->first()->code,
                    "remark"        =>  $faker->sentence(),
                    "for"           =>  Family::where('user', $user)->inRandomOrder()->first()->id,
                    "balance"       =>  $faker->randomFloat(2, 100000, 1000000),
                    "receipt_date"  =>  $faker->date(),
                    "start_date"    =>  $faker->date(),
                    "end_date"      =>  $faker->date($format = 'Y-m-d', $max = '+3 days'),
                    "period"        =>  ReimbursePeriod::inRandomOrder()->first()->code,
                ]
            );
        }
    }
}
