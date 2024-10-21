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
        $usr_amt = User::count();
        for ($i = 1; $i <= $usr_amt; $i++) {
            $rand_fams = rand(1, 5);
            for ($j = 1; $j <= $rand_fams; $j++) {
                Family::create([
                    'user'      =>  User::where('id', $i)->first()->nip,
                    'name'      =>  $faker->name,
                    'status'    =>  $st_psb[rand(0, 1)],
                    'bod'       =>  $faker->date()
                ]);
            }
        }
    }
}
