<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('master_bank_keys', function (Blueprint $table) {
            $table->id();
            $table->string('region_key', 3)->index();
            $table->string('bank_keys', 15)->index();
            $table->string('name_financial_institution', 60)->index();
            $table->string('city', 35)->index();
            $table->string('street_house_number', 35)->index();
            $table->string('bank_branch', 40)->index();
            $table->timestamps();
            $table->unique(['region_key', 'bank_keys'], 'region_key_bank_keys_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_bank_keys');
    }
};
