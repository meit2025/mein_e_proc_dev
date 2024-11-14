<?php

namespace Modules\BusinessTrip\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Modules\BusinessTrip\Models\PurposeType;
use Modules\BusinessTrip\Models\PurposeTypeAllowance;

class PurposeTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $this->call([]);

        DB::table('purpose_types')->truncate();

        $data = [
            [
                'code' => 'DOMESTIC1DAYSECTORA',
                'name' => '1 Day sector A (non Jawa and Madura)'
                
            ],
            [
                'code' => 'DOMESTIC1DAYSECTORB',
                'name' => '1 Day sector B (Jawa Madura)'
               
            ]
        ];

        DB::beginTransaction();

        DB::table('purpose_type_allowances')->truncate();
        try {
            foreach($data as $dat) {
                $purposeType = PurposeType::create([
                    'code' => $dat['code'],
                    'name' => $dat['name'],
                    'attedance_status' => 'BST'
                ]);

              
                PurposeTypeAllowance::create([
                    'purpose_type_id' => $purposeType->id,
                    'allowance_items_id' => 1
                ]);
            }

            DB::commit();
        }
        catch(\Exception $e) {
            dd($e);
            DB::rollBack();
        }

    }
}
