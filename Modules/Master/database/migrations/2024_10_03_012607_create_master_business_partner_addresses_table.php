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
        Schema::create('master_business_partner_addresses', function (Blueprint $table) {
            $table->id();

            $table->string('address_number');
            $table->string('date_of_move')->nullable();
            $table->string('validity_start')->nullable();
            $table->string('validity_end')->nullable();
            $table->string('external_address_number')->nullable();
            $table->string('valid_from_date');
            $table->string('uuid_character_form');
            $table->string('move_target_address')->nullable();
            $table->string('version_id')->nullable();
            $table->string('partner_number');
            $table->string('is_standard_address')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_business_partner_addresses');
    }
};
