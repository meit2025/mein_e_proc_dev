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
        Schema::create('reimburse_used', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reimburse')->constrained('reimburses')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('user');
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('user')->references('nip')->on('users')->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reimburse_used');
    }
};
