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
        Schema::table('users', function (Blueprint $table) {
            //
            $table->dropColumn('role');
            $table->dropColumn('job_level');
            $table->dropColumn('division');
            $table->dropColumn('immediate_spv');

            $table->unsignedBigInteger('division_id')->nullable();
            $table->unsignedBigInteger('position_id')->nullable();
            $table->unsignedBigInteger('departement_id')->nullable();
            $table->boolean('is_approval')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->string('role');
            $table->string('job_level');
            $table->string('division');
            $table->string('immediate_spv');

            $table->dropColumn('division_id');
            $table->dropColumn('position_id');
            $table->dropColumn('departement_id');
            $table->dropColumn('is_approval');
        });
    }
};
