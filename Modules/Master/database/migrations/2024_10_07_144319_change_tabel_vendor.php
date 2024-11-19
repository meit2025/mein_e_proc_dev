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
        //
        Schema::dropIfExists('master_business_partners');
        Schema::dropIfExists('master_business_partner_addresses');
        Schema::dropIfExists('master_business_partner_banks');
        Schema::dropIfExists('master_business_partner_address_details');
        Schema::dropIfExists('master_business_partner_address_numbers');
        Schema::dropIfExists('master_business_partner_tax_numbers');
        Schema::create('master_business_partners', function (Blueprint $table) {
            $table->id();
            $table->string('external_partner_number', 20);
            $table->string('partner_grouping', 4);
            $table->string('search_term_one', 20);
            $table->string('name_one', 40);
            $table->string('partner_number', 15);
            $table->string('central_block', 10);
            $table->string('city', 40);
            $table->string('country', 10);
            $table->string('postal_code', 10);
            $table->string('tax_number', 20);
            $table->string('number_supplier', 10);
            $table->string('delete', 10);
            $table->string('purchasing_block', 10);
            $table->enum('type', ['vendor', 'employee']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
