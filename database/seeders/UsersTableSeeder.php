<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
                'grade_reimburse'   =>  'A',
                'password'          =>  Hash::make('password'),
                'created_at'        =>  now(),
                'updated_at'        =>  now(),
            ],
            [
                'nip'               =>  '23456',
                'division'          =>  'IT',
                'role'              =>  'user',
                'job_level'         =>  'manager',
                'immediate_spv'     =>  '00001',
                'name'              =>  'John',
                'email'             =>  'manager@gmail.com',
                'email_verified_at' =>  now(),
                'grade_reimburse'   =>  'B',
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
                'grade_reimburse'   =>  'C',
                'password'          =>  Hash::make('password'),
                'created_at'        =>  now(),
                'updated_at'        =>  now(),
            ]
        ]);
    }
}
