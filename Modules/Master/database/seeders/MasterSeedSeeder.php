<?php

namespace Modules\Master\Database\Seeders;

use Illuminate\Database\Seeder;
use DB;




class MasterSeedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $this->call([])  ;

        $data = [
            [
                "name" => 'Approve',
                'code' => 'approve',
                'className' => 'bg-green-100 text-green-600 border-green-600'
            ],
            [
                "name" => 'Waiting Approve',
                'code' => 'waiting_approve',
                'className' => 'bg-orange-100 text-orange-600 border-orange-600'
            ],

            [
                "name" => 'Rejected',
                'code' => 'rejected',
                'className' => 'bg-red-100 text-red-600 border-red-600'
            ],

            [
                "name" => 'Cancel',
                'code' => 'cancel',
                'className' => 'bg-red-100 text-red-600 border-red-600'
            ],

            [
                "name" => 'Fully Approve',
                'code' => 'fully_approve',
                'className' => 'bg-green-100 text-green-600 border-green-600'
            ],
        ];



        foreach ($data as $dat) {
        }
    }
}
