<?php

namespace Modules\Reimbuse\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Reimbuse\Models\ReimburseType;

class ReimburseTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ReimburseType::insert([
            [
                "code"          =>  "PS1",
                "name"          =>  "Persalinan",
                "is_employee"   =>  0,
            ],
            [
                "code"          =>  "IB1",
                "name"          =>  "Perjalanan Rohani",
                "is_employee"   =>  0,
            ],
            [
                "code"          =>  "IB2",
                "name"          =>  "ATK",
                "is_employee"   =>  1,
            ],
        ]);
    }
}
