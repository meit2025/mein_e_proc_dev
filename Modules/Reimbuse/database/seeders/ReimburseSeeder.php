<?php

namespace Modules\Reimbuse\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Reimbuse\Models\Reimburse;

class ReimburseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Reimburse::create(
            [
                "type" => "IB1",
                "requester" => "12345",
                "remark" => "AKU MAU HAJI",
                "balance" => "25000000",
                "receipt_date" => "2024-09-21",
                "start_date" => "2024-09-23",
                "end_date" => "2024-09-21",
                "start_balance_date" => "2024-09-25",
                "end_balance_date" => "2024-09-26",
                "currency" => "IDR"
            ]
        );
    }
}
