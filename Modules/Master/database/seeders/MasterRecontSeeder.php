<?php

namespace Modules\Master\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Master\Models\MasterRecont;

class MasterRecontSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MasterRecont::create([
            "account" => "0015120100",
            "recon_acc" => "D",
            "desc" => "CUSTOMER",
            "account_long_text" => "Machinery and equip.in assembly, machinery and equ",
        ]);
    }
}
