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
        // [
        //     {
        //       "extdoc": "4500000011",
        //       "belnr": "1200000001",
        //       "bukrs": "1600",
        //       "gjahr": "2024",
        //       "status" : "S",
        //       "message" : "DP has been successfuly created",
        //       "code" : "BTRE"
        //     }
        //   ]
        Schema::table('cash_advances', function (Blueprint $table) {
            $table->string('extdoc')->nullable();
            $table->string('bukrs')->nullable();
            $table->string('status')->nullable();
            $table->string('message')->nullable();
            $table->string('code')->nullable();
            $table->string('belnr')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('cash_advances', function (Blueprint $table) {
            $table->dropColumn('extdoc');
            $table->dropColumn('bukrs');
            $table->dropColumn('status');
            $table->dropColumn('message');
            $table->dropColumn('code');
            $table->dropColumn('belnr');
        });
    }
};
