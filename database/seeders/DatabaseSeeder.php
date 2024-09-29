<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Modules\Reimbuse\Database\Seeders\ReimburseGroupSeeder;
use Modules\Reimbuse\Database\Seeders\ReimbursePeriodSeeder;
use Modules\Reimbuse\Database\Seeders\ReimburseProgressSeeder;
use Modules\Reimbuse\Database\Seeders\ReimburseSeeder;
use Modules\Reimbuse\Database\Seeders\ReimburseTypeSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // $this->call(UsersTableSeeder::class);
        $this->call([
            UsersTableSeeder::class,
            CurrencySeeder::class,
            ReimburseTypeSeeder::class,
            ReimbursePeriodSeeder::class,
            // ReimburseGroupSeeder::class,
            // ReimburseSeeder::class,
            // ReimburseProgressSeeder::class
        ]);
    }
}
