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
        Schema::create('business_trip_detail_attedances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_trip_id');
            $table->unsignedBigInteger('business_trip_destination_id');
            $table->string('shift_code');
            $table->time('shift_end');
            $table->time('shift_start');
            $table->time('start_time');
            $table->time('end_time');
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_trip_detail_attedances');
    }
};
