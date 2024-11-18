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
        Schema::table('business_trip_detail_destination_totals', function (Blueprint $table) {
            $table->decimal('standard_value', 10, 2)->nullable();
            $table->decimal('percentage', 10, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_trip_detail_destination_totals', function (Blueprint $table) {
            $table->dropColumn(['standard_value', 'percentage']);
        });
    }
};
