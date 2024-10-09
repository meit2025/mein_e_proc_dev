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
        Schema::create('business_trip_destinations', function (Blueprint $table) {
            $table->id();
            $table->string('destination');
            $table->date('business_trip_start_date');
            $table->date('business_trip_end_date');
            $table->unsignedBigInteger('business_trip_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_trip_destinations');
    }
};
