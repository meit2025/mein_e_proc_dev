<?php

namespace Database\Seeders;

use App\Models\Family;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
        for ($i = 0; $i < 10; $i++) {
            Family::create([
                'user'      =>  User::inRandomOrder()->first()->nip,
                'name'      =>  $faker->name,
                'status'    =>  $st_psb[rand(0, 1)],
                'bod'       =>  $faker->date()
            ]);
        }
    }
}
