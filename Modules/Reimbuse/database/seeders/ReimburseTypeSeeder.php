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
                "group"         =>  null,
                "name"          =>  "Persalinan",
                "claim_limit"   =>  "2",
                "plafon"        =>  "100000"
            ],
            [
                "code"          =>  "IB1",
                "group"         =>  "gr1",
                "name"          =>  "Ibadah Haji",
                "claim_limit"   =>  "1",
                "plafon"        =>  "100000000"
            ],
            [
                "code"          =>  "IB2",
                "group"         =>  "gr1",
                "name"          =>  "Ibadah Umrah",
                "claim_limit"   =>  null,
                "plafon"        =>  "50000000"
            ],
        ]);
    }
}
