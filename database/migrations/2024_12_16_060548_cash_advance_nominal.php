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
        Schema::table('cash_advance_purchases', function (Blueprint $table) {
            $table->bigInteger('nominal')->default(0);
        });
        Schema::table('purchases', function (Blueprint $table) {
            $table->boolean('is_cashAdvance')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('cash_advance_purchases', function (Blueprint $table) {
            $table->dropColumn('nominal');
        });
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropColumn('is_cashAdvance');
        });
    }
};
