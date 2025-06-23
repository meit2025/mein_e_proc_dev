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
        Schema::table('purchase_requisitions', function (Blueprint $table) {
            $table->string('business_trip_day_total_id')->nullable();
            $table->string('business_trip_day_total_type')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
         Schema::table('purchase_requisitions', function (Blueprint $table) {
            $table->dropColumn('business_trip_day_total_id');
            $table->dropColumn('business_trip_day_total_type');
        });
    }
};
