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
        Schema::create('business_trip_progress', function (Blueprint $table) {
            $table->id();
            $table->string('business_trip');
            $table->string('approver');
            $table->longText('notes');
            $table->enum('status', ['Approved', 'Rejected', 'Waiting'])->default('Waiting');
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('business_trip')->references('rn')->on('business_trips')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreign('approver')->references('nip')->on('users')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_trip_progress');
    }
};
