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
        Schema::table('users', function (Blueprint $table) {
            $table->string('user_id_mein_attandace')->nullable();
            $table->string('sensor_id_mein_attadance')->nullable();
            $table->string('sn_mein_attandance')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('user_id_mein_attandace');
            $table->dropColumn('sensor_id_mein_attadance');
            $table->dropColumn('sn_mein_attandance');
        });
    }
};
