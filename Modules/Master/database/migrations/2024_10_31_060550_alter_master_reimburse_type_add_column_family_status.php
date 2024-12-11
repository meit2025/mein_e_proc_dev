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
        Schema::table('master_type_reimburses', function (Blueprint $table) {
            $table->string('family_status', 255)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('master_type_reimburses', function (Blueprint $table) {
            $table->string('family_status', 255)->nullable();
        });
    }
};
