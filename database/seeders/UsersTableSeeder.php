<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        User::insert([
            [
                'nip'               =>  '00001',
                'division'          =>  'IT',
                'role'              =>  'user',
                'job_level'         =>  'direktur',
                'immediate_spv'     =>  null,
                'name'              =>  'John Doe',
                'email'             =>  'direktur@gmail.com',
                'email_verified_at' =>  now(),
                'grade_reimburse'   =>  Grade::inRandomOrder()->first()->id,
                'password'          =>  Hash::make('password'),
                'created_at'        =>  now(),
                'updated_at'        =>  now(),
            ],
            [
                'nip'               =>  '23456',
                'division'          =>  'IT',
                'role'              =>  'admin',
                'job_level'         =>  'manager',
                'immediate_spv'     =>  '00001',
                'name'              =>  'John',
                'email'             =>  'manager@gmail.com',
                'email_verified_at' =>  now(),
                'grade_reimburse'   =>  Grade::inRandomOrder()->first()->id,
                'password'          =>  Hash::make('password'),
                'created_at'        =>  now(),
                'updated_at'        =>  now(),
            ],
            [
                'nip'               =>  '12345',
                'division'          =>  'IT',
                'role'              =>  'user',
                'job_level'         =>  'staff',
                'immediate_spv'     =>  '23456',
                'name'              =>  'Doe',
                'email'             =>  'staff@gmail.com',
                'email_verified_at' =>  now(),
                'grade_reimburse'   =>  '1',
                'password'          =>  Hash::make('password'),
                'created_at'        =>  now(),
                'updated_at'        =>  now(),
            ]
        ]);

        for ($i = 0; $i < 20; $i++) {
            User::create(
                [
                    'nip'               =>  $faker->uuid(),
                    'division'          =>  'IT',
                    'role'              =>  'user',
                    'job_level'         =>  'staff',
                    'immediate_spv'     =>  '23456',
                    'name'              =>  $faker->safeEmail(),
                    'email'             =>  $faker->email(),
                    'email_verified_at' =>  now(),
                    'grade_reimburse'   =>  Grade::inRandomOrder()->first()->id,
                    'password'          =>  Hash::make('password'),
                    'created_at'        =>  now(),
                    'updated_at'        =>  now(),
                ]
            );
        }
    }
}
