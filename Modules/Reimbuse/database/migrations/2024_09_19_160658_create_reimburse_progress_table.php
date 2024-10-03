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
        Schema::create('reimburse_progress', function (Blueprint $table) {
            $table->id();
            $table->string('reimburse');
            $table->string('approver');
            $table->longText('notes');
            $table->enum('status', ['Approved', 'Rejected', 'Open'])->default('Open');
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('reimburse')->references('rn')->on('reimburses')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreign('approver')->references('nip')->on('users')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reimburse_progress');
    }
};
