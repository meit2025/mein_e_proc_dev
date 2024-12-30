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
        Schema::table('approval_prs', function (Blueprint $table) {
            $table->unsignedBigInteger('master_position_id')->nullable();
            $table->foreign('master_position_id')->references('id')->on('master_positions')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('approval_prs', function (Blueprint $table) {
            $table->dropColumn('master_position_id');
        });
    }
};
