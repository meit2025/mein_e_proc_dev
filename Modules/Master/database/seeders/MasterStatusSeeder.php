<?php

namespace Modules\Master\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Modules\Master\Models\MasterStatus;

class MasterStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $this->call([]);

        DB::table('master_statuses')->truncate();

        $data = [
            [
                "id" => 1,
                "name" => 'Waiting Approve ',
                'code' => 'waiting_approve',
                'classname' => 'bg-orange-100 text-orange-600 border-orange-600'
            ],
            [
                "id" => 2,
                "name" => 'Cancel',
                'code' => 'cancel',
                'classname' => 'bg-red-100 text-red-600 border-red-600'
            ],
            [
                "id" => 3,
                "name" => 'Approve',
                'code' => 'approve_to',
                'classname' => 'bg-green-100 text-green-600 border-green-600'
            ],
            [
                "id" => 4,
                "name" => 'Reject',
                'code' => 'reject_to',
                'classname' => 'bg-red-100 text-red-600 border-red-600'
            ],
            [
                "id" => 5,
                "name" => 'Fully Approve',
                'code' => 'fully_approve',
                'classname' => 'bg-green-100 text-green-600 border-green-600'
            ],
            [
                "id" => 6,
                "name" => 'Revise',
                'code' => 'revise',
                'classname' => 'bg-red-100 text-red-600 border-red-600'
            ]

        ];



        foreach ($data as $dat) {
            $check =  MasterStatus::where('code', $dat['code'])->first();


            if (!$check) {
                MasterStatus::create(
                    [
                        'id' => $dat['id'],
                        'code' => $dat['code'],
                        'name' => $dat['name'],
                        'classname' => $dat['classname']
                    ]
                );
            }
        }
    }
}
