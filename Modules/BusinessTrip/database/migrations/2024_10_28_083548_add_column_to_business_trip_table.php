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
        Schema::table('business_trip', function (Blueprint $table) {
            $table->unsignedBigInteger('cost_center_id')->nullable();
            $table->unsignedBigInteger('pajak_id')->nullable();
            $table->unsignedBigInteger('purchasing_group_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_trip', function (Blueprint $table) {
            $table->dropColumn(['cost_center_id', 'pajak_id', 'purchasing_group_id']);
        });
    }
};
