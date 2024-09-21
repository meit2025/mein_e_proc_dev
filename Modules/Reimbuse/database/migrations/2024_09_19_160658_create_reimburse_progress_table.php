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
            $table->foreignId('reimburse')->constrained('reimburses')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('approver')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->longText('notes');
            $table->enum('status', ['Approved', 'Rejected', 'Waiting'])->default('Waiting');
            $table->softDeletes();
            $table->timestamps();
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
