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
        Schema::create('master_business_partner_address_numbers', function (Blueprint $table) {
            $table->id();
            $table->string('address_number'); // Address Number
            $table->string('address_type');             // Address Type
            $table->string('business_partner_number');  // Business Partner Number
            $table->string('valid_to')->nullable();  // Communication Data: Valid To (YYYYMMDDHHMMSS)
            $table->string('indicator_standard'); // Indicator: Standard Address Usage
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_business_partner_address_numbers');
    }
};
