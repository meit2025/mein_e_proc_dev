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
            $table->unsignedBigInteger('allowance_item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_trip_detail_destination_totals', function (Blueprint $table) {
            $table->dropForeign(['allowance_item_id']);
            $table->dropColumn('allowance_item_id');
        });
    }
};
