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
        Schema::table('reimburses', function (Blueprint $table) {
            $table->float('remaining_balance_when_request')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reimburses', function (Blueprint $table) {
            $table->dropColumn(['remaining_balance_when_request']);
        });
    }
};
