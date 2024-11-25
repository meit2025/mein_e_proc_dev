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
        Schema::create('approval_tracking_number_choose_routes', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('master_tracking_number_id');
            $table->bigInteger('approval_tracking_number_choose_id');
            $table->foreign('master_tracking_number_id')->references('id')->on('master_tracking_numbers')->onUpdate('cascade');
            $table->foreign('approval_tracking_number_choose_id')->references('id')->on('approval_tracking_number_chooses')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_tracking_number_choose_routes');
    }
};
