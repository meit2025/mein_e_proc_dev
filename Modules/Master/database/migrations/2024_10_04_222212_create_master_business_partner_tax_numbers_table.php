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
        Schema::create('master_business_partner_tax_numbers', function (Blueprint $table) {
            $table->id();
            $table->string('business_partner_number');    // Business Partner Number
            $table->string('business_partner_tax_number'); // Business Partner Tax Number
            $table->string('tax_number_category');        // Tax Number Category
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_business_partner_tax_numbers');
    }
};
