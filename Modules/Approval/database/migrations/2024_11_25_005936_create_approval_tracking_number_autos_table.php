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
        Schema::create('approval_tracking_number_autos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purchasing_group_id')->nullable();
            $table->unsignedBigInteger('master_tracking_number_id')->nullable();
            $table->timestamps();


            $table->foreign('purchasing_group_id')
                ->references('id')
                ->on('purchasing_groups')
                ->onDelete('set null');

            $table->foreign('master_tracking_number_id')
                ->references('id')
                ->on('master_tracking_numbers')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_tracking_number_autos');
    }
};
