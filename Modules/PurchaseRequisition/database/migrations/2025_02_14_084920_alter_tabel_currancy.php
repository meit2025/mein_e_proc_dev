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
            $table->string('currency')->nullable()->default('IDR');
        });

        Schema::table('purchases', function (Blueprint $table) {
            $table->string('currency_from')->nullable()->default('IDR');
            $table->string('currency_to')->nullable()->default(null);
            $table->boolean('is_conversion_currency')->default(false);
        });

        Schema::table('units', function (Blueprint $table) {
            $table->string('total_amount_conversion')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('purchase_requisitions', function (Blueprint $table) {
            $table->dropColumn('currency')->nullable()->default(null);
        });

        Schema::table('purchases', function (Blueprint $table) {
            $table->dropColumn('currency_form')->nullable()->default(null);
            $table->dropColumn('currency_to')->nullable()->default(null);
        });

        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn('total_amount_idr')->nullable()->default(null);
        });
    }
};
