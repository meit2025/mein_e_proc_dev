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
        Schema::create('bussiness_trip_destination_allowances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_trip_destination_id');
            $table->unsignedBigInteger('business_trip_id');
            $table->unsignedBigInteger('allowance_item_id');
            $table->unsignedBigInteger('allowance_code');
            $table->unsignedBigInteger('allowance_name');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bussiness_trip_destination_allowances');
    }
};
