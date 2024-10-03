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
        Schema::table('master_reconts', function (Blueprint $table) {
            $table->string('desc', 10)->index()->nullable();
            $table->string('recon_acc', 50)->index()->unique();
        });

        Schema::table('master_assets', function (Blueprint $table) {
            $table->string('delete')->index()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('master_reconts', function (Blueprint $table) {
            $table->dropColumn('desc', 10)->index()->nullable();
            $table->dropColumn('recon_acc', 50)->index()->unique();
        });

        Schema::table('master_assets', function (Blueprint $table) {
            $table->dropColumn('delete')->index()->nullable();
        });
    }
};
