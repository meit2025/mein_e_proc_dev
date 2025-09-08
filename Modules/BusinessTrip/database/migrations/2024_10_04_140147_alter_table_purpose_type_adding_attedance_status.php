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
        Schema::table(
            'purpose_types',
            function (Blueprint $table) {
                $table->string('attedance_status');
            });
        //
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //

        Schema::table(
            'purpose_types',
            function (Blueprint $table) {
                $table->dropColumn('attedance_status');
            }
        );
    }
};
