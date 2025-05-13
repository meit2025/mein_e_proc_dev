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
            $table->string('type_approval_conditional')->default('nominal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('approval_routes', function (Blueprint $table) {
            $table->dropColumn('type_approval_conditional')->default('nominal');
        });
    }
};
