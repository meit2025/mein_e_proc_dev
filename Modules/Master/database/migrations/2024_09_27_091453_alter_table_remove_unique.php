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
        Schema::table('master_materials', function (Blueprint $table) {
            $table->string('delete', 10)->nullable();
        });

        Schema::table('master_reconts', function (Blueprint $table) {
            // Remove unique constraint
            $table->dropUnique(['recon_acc']);
            $table->dropUnique(['account_long_text']);
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
