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
        Schema::table('reimburse_group_and_reimburse_businesstrip', function (Blueprint $table) {
            //
        });

        Schema::table('reimburse_groups', function (Blueprint $table) {
            $table->dropForeign(['status_id']);
        });

        Schema::table('reimburses', function (Blueprint $table) {
            $table->dropForeign(['status_id']);
        });

        Schema::table('business_trip', function (Blueprint $table) {
            $table->dropForeign(['status_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reimburse_group_and_reimburse_businesstrip', function (Blueprint $table) {
            //
        });

        Schema::table('reimburse_groups', function (Blueprint $table) {
            $table->foreign('status_id')->on('master_statuses')->references('id')->onUpdate('cascade');
        });
        Schema::table('reimburses', function (Blueprint $table) {
            $table->foreign('status_id')->on('master_statuses')->references('id')->onUpdate('cascade');
        });
        Schema::table('business_trip', function (Blueprint $table) {
            $table->foreign('status_id')->on('master_statuses')->references('id')->onUpdate('cascade');
        });
    }
};
