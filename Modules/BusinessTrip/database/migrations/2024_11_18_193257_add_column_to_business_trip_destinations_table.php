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
        Schema::table('business_trip_destinations', function (Blueprint $table) {
            $table->unsignedBigInteger('pajak_id')->nullable();
            $table->unsignedBigInteger('purchasing_group_id')->nullable();
        });
        Schema::table('business_trip', function (Blueprint $table) {
            $table->dropForeign(['pajak_id','purchasing_group_id']);
            $table->dropColumn(['pajak_id','purchasing_group_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_trip_destinations', function (Blueprint $table) {
            $table->dropForeign(['pajak_id','purchasing_group_id']);
            $table->dropColumn(['pajak_id','purchasing_group_id']);
        });
        Schema::table('business_trip', function (Blueprint $table) {
            $table->unsignedBigInteger('pajak_id')->nullable();
            $table->unsignedBigInteger('purchasing_group_id')->nullable();
        });
    }
};
