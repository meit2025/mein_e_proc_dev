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
        Schema::create('master_business_partners', function (Blueprint $table) {
            $table->id();
            $table->string('external_partner_number');
            $table->string('partner_grouping');
            $table->string('search_term_one');
            $table->string('search_term_two');
            $table->string('name_one');
            $table->string('name_two');
            $table->string('name_three');
            $table->string('name_four');
            $table->string('partner_number');
            $table->string('form_of_address_key');
            $table->string('central_block');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_business_partners');
    }
};
