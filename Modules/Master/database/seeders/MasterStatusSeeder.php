<?php

namespace Modules\Master\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Master\Models\MasterStatus;

class MasterStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $this->call([]);

        $data = [
            [
                "name" => 'Approve',
                'code' => 'approve',
                'classname' => 'bg-green-100 text-green-600 border-green-600'
            ],
            [
                "name" => 'Waiting Approve',
                'code' => 'waiting_approve',
                'classname' => 'bg-orange-100 text-orange-600 border-orange-600'
            ],

            [
                "name" => 'Rejected',
                'code' => 'rejected',
                'classname' => 'bg-red-100 text-red-600 border-red-600'
            ],

            [
                "name" => 'Cancel',
                'code' => 'cancel',
                'classname' => 'bg-red-100 text-red-600 border-red-600'
            ],
        ];



        foreach ($data as $dat) {
            $check =  MasterStatus::where('code', $dat['code'])->first();


            if (!$check) {
                MasterStatus::create([
                    'code' => $dat['code'],
                    'name' => $dat['name'],
                    'classname' => $dat['classname']
                ]);
            }
        }
    }
}
