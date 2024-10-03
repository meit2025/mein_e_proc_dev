<?php

namespace Modules\Reimbuse\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Reimbuse\Models\ReimburseGroup;

class ReimburseGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ReimburseGroup::insert(
            [
                [
                    'code'      =>  'Asal123',
                    'remark'    =>  'Reimburse Persalinan'
                ],
                [
                    'code'      =>  'Asal321',
                    'remark'    =>  'Reimburse Ibadah Haji'
                ]
            ]
        );
    }
}
