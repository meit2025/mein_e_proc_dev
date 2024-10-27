<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Master\Database\Seeders\FamilySeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UsersTableSeeder::class,
            FamilySeeder::class,
            CurrencySeeder::class,
        ]);
    }
}
