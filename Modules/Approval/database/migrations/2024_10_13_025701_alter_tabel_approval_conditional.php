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
        Schema::table('approval_routes', function (Blueprint $table) {
            $table->boolean('is_conditional')->default(false);
            $table->string('nominal')->default('0');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('approval_routes', function (Blueprint $table) {
            $table->dropColumn('is_conditional')->default(false);
            $table->dropColumn('nominal')->default('0');
        });
    }
};
