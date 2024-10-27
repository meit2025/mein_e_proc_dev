<?php

namespace Modules\Master\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Modules\Master\Models\Family;
use Faker\Factory as Faker;

class FamilySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $faker = Faker::create();
        for ($i = 0; $i < 20; $i++) {
            Family::make([
                'name'      => $faker->name(),
                'status'    => ['child', 'wife'][rand(0,1)],
                'bod'       => $faker->dateTime(),
                'user'      => User::inRandomOrder()->first()->nip
            ]);
        }
    }
}
