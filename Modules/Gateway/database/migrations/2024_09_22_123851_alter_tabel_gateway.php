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
        Schema::table('gateways', function (Blueprint $table) {
            $table->string("code_endpoint")->unique();
        });
        Schema::table('gateways', function (Blueprint $table) {
            $table->dropColumn("authentication");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('gateways', function (Blueprint $table) {
            $table->dropColumn("code_endpoint")->unique();
        });
        Schema::table('gateways', function (Blueprint $table) {
            $table->string("authentication")->nullable();
        });
    }
};
