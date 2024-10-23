<?php

namespace Database\Seeders;

use App\Models\Family;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class FamilySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $st_psb = ['wife', 'child'];
        $faker = Faker::create();
        Family::insert(
            [
                [
                    'user'      =>  '12345',
                    'name'      =>  $faker->name,
                    'status'    =>  $st_psb[rand(0, 1)],
                    'bod'       =>  $faker->date()
                ],
                [
                    'user'      =>  '12345',
                    'name'      =>  $faker->name,
                    'status'    =>  $st_psb[rand(0, 1)],
                    'bod'       =>  $faker->date()
                ],
                [
                    'user'      =>  '12345',
                    'name'      =>  $faker->name,
                    'status'    =>  $st_psb[rand(0, 1)],
                    'bod'       =>  $faker->date()
                ],
            ]
        );
    }
}
