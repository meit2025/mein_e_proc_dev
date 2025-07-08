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
        Schema::table('business_trip_detail_destination_day_totals', function (Blueprint $table) {
            $table->string('parent_id')->nullable();
        });

        Schema::table('business_trip_detail_destination_totals', function (Blueprint $table) {
            $table->string('parent_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('business_trip_detail_destination_day_totals', function (Blueprint $table) {
            $table->dropColumn('parent_id');
        });

        Schema::table('business_trip_detail_destination_totals', function (Blueprint $table) {
            $table->dropColumn('parent_id');
        });
    }
};
