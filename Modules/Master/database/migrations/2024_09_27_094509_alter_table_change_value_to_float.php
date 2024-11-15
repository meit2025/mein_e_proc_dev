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
        Schema::table('master_assets', function (Blueprint $table) {
            $table->dropColumn('qty');
        });

        Schema::table('master_assets', function (Blueprint $table) {
            $table->float('qty', 8, 2)->nullable();
        });

        Schema::table('master_materials', function (Blueprint $table) {
            $table->string('base_unit_of_measure')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
