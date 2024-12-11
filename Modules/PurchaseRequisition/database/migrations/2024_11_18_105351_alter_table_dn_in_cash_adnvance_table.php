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
        Schema::table('cash_advances', function (Blueprint $table) {
            $table->string('dp')->nullable()->default('0');
            $table->string('unit_id')->nullable();
        });

        Schema::table('cash_advance_purchases', function (Blueprint $table) {
            $table->string('dp')->nullable()->default('0');
            $table->string('unit_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('cash_advances', function (Blueprint $table) {
            $table->dropColumn('dp');
        });
        Schema::table('cash_advance_purchases', function (Blueprint $table) {
            $table->dropColumn('dp');
        });
    }
};
