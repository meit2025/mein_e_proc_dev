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
            // $table->dropPrimary('code');
            $table->bigInteger('id')->unsigned()->nullable();
            // $table->timestamps();
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
            $table->dropColumn('id');
            // $table->dropTimestamps();
        });
    }
};
