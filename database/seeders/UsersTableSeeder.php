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
                'division_id'          =>  1,
                'position_id'          =>  1,
                'departement_id'          =>  1,
                'role_id'              =>  null,
                'name'              =>  'John Doe',
                'username'          =>  'bos',
                'email'             =>  'direktur@gmail.com',
                'email_verified_at' =>  now(),
                'password'          =>  Hash::make('password'),
                'created_at'        =>  now(),
                'updated_at'        =>  now(),
            ],
            [
                'nip'               =>  '23456',
                'division_id'          =>  1,
                'position_id'          =>  1,
                'departement_id'          =>  1,
                'role_id'              =>  null,
                'name'              =>  'John',
                'username'          =>  'admin',
                'email'             =>  'manager@gmail.com',
                'email_verified_at' =>  now(),
                'password'          =>  Hash::make('password'),
                'created_at'        =>  now(),
                'updated_at'        =>  now(),
            ],
            [
                'nip'               =>  '12345',
                'division_id'          =>  1,
                'position_id'          =>  1,
                'departement_id'          =>  1,
                'role_id'              =>  null,
                'name'              =>  'Doe',
                'username'          =>  'staff',
                'email'             =>  'staff@gmail.com',
                'email_verified_at' =>  now(),
                'password'          =>  Hash::make('password'),
                'created_at'        =>  now(),
                'updated_at'        =>  now(),
            ]
        ]);

        for ($i = 0; $i < 20; $i++) {
            User::create(
                [
                    'nip'               =>  $faker->uuid(),
                    'division_id'          =>  1,
                    'position_id'          =>  1,
                    'departement_id'          =>  1,
                    'role_id'              =>  null,
                    'name'              =>  $faker->safeEmail(),
                    'email'             =>  $faker->email(),
                    'email_verified_at' =>  now(),
                    'password'          =>  Hash::make('password'),
                    'created_at'        =>  now(),
                    'updated_at'        =>  now(),
                ]
            );
        }
    }
}
