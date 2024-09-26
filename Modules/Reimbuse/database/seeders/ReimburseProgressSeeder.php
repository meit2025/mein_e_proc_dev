<?php

namespace Modules\Reimbuse\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Modules\Reimbuse\Models\ReimburseGroup;
use Modules\Reimbuse\Models\ReimburseProgress;
use Faker\Factory as Faker;
use Modules\Reimbuse\Models\Reimburse;

class ReimburseProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $sum_group = ReimburseGroup::count();
        for ($i = 0; $i < $sum_group; $i++) {
            $user = User::select('immediate_spv', 'nip')->inRandomOrder()->first();
            if($user->immediate_spv !== null){
                ReimburseProgress::create(
                    [
                        "reimburse" =>  Reimburse::inRandomOrder()->first()->rn,
                        "approver"  =>  $user->immediate_spv,
                        "notes"     =>  $faker->sentence(),
                        "status"    =>  ['Approved', 'Rejected', 'Open'][rand(0, 2)]
                    ]
                );
            }
        }
    }
}
