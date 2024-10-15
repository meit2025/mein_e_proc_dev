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
        Schema::create('business_trip_detail_destination_totals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_trip_destination_id');
            $table->unsignedBigInteger('business_trip_id');
            $table->float('price')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_trip_detail_destination_totals');
    }
};
