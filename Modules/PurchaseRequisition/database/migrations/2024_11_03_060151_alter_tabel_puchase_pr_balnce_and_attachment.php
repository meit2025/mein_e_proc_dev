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
        Schema::table('purchase_requisitions', function (Blueprint $table) {
            $table->string('attachment')->nullable();
            $table->string('balance')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('purchase_requisitions', function (Blueprint $table) {
            $table->dropColumn('attachment')->nullable();
            $table->dropColumn('balance')->nullable();
        });
    }
};
