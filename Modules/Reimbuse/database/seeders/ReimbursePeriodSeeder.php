<?php

namespace Modules\Reimbuse\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Reimbuse\Models\ReimbursePeriod;

class ReimbursePeriodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ReimbursePeriod::insert(
            [
                [
                    'code'  =>  'pd-01',
                    'start' =>  '2022-01-01',
                    'end'   =>  '2022-12-31'
                ],
                [
                    'code'  =>  'pd-02',
                    'start' =>  '2023-01-01',
                    'end'   =>  '2023-12-31'
                ],
                [
                    'code'  =>  'pd-03',
                    'start' =>  '2024-01-01',
                    'end'   =>  '2024-12-31'
                ],
            ]
        );
    }
}
