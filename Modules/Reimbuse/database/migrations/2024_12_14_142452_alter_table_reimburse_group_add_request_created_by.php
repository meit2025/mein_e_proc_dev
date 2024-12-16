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
        Schema::table('reimburse_groups', function (Blueprint $table) {
            $table->unsignedBigInteger('request_created_by')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //

        Schema::table('reimburse_groups', function (Blueprint $table) {
            $table->dropColumn('request_created_by');
        });
    }
};
