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
            $table->dropColumn(['period', 'start_date', 'end_date', 'uom']);
            $table->date('claim_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //

        Schema::table('reimburses', function (Blueprint $table) {
            $table->dropColumn(['claim_date']);
            $table->string('period');
            $table->date('start_date');
            $table->date('end_date');


            $table->foreign('period')->references('code')->on('master_period_reimburses')->cascadeOnUpdate();
        });
    }
};
