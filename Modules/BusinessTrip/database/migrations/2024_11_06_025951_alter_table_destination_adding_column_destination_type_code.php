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
        Schema::table('destinations', function (Blueprint $table) {
            // $table->string('code')->primary();
            $table->string('region')->nullable()->change();
            $table->string('type')->nullable();
            $table->string('destination')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //

        Schema::table('destinations', function (Blueprint $table) {
            // $table->string('code')->primary();

            $table->dropColumn('type');
            $table->dropColumn('destination');
        });
    }
};
