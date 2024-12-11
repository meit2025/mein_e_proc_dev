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
            $table->bigInteger('pajak_id')->nullable();
            $table->bigInteger('purchasing_group_id')->nullable();
            $table->tinyInteger('cash_advance')->default(0);
            $table->double('total_percent')->nullable();
            $table->double('total_cash_advance')->nullable();
            $table->string('reference_number')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_trip_destinations', function (Blueprint $table) {
            $table->dropColumn('pajak_id');
            $table->dropColumn('purchasing_group_id');
            $table->dropColumn('cash_advance');
            $table->dropColumn('total_percent');
            $table->dropColumn('total_cash_advance');
            $table->dropColumn('reference_number');
        });
    }
};
