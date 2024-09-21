<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Currency::insert([
            [
                'code'  =>  "IDR",
                'name'  =>  "Rupiah",
            ],
            [
                'code'  =>  "USD",
                'name'  =>  "Dolar (Amerika)",
            ],
        ]);
    }
}
