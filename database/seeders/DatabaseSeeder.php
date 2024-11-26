<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Gateway\Database\Seeders\GatewaySeedSeeder;
use Modules\Master\Database\Seeders\FamilySeeder;
use Modules\Master\Database\Seeders\MasterAssetSeeder;
use Modules\Master\Database\Seeders\MasterBankKeySeeder;
use Modules\Master\Database\Seeders\MasterCostCenterSeeder;
use Modules\Master\Database\Seeders\MasterMaterialSeeder;
use Modules\Master\Database\Seeders\MasterOrderSeeder;
use Modules\Master\Database\Seeders\MasterRecontSeeder;
use Modules\Master\Database\Seeders\MasterStatusSeeder;
use Modules\Master\Database\Seeders\MaterialGroupSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            GatewaySeedSeeder::class,
            MaterialGroupSeeder::class,
            MasterMaterialSeeder::class,
            MasterAssetSeeder::class,
            MasterOrderSeeder::class,
            MasterCostCenterSeeder::class,
            MasterRecontSeeder::class,
            MasterBankKeySeeder::class,
            UsersTableSeeder::class,
            FamilySeeder::class,
            CurrencySeeder::class,
            MasterStatusSeeder::class,
        ]);
    }
}
