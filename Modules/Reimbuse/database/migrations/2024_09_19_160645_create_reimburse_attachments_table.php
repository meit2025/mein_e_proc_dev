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
        Schema::create('reimburse_attachments', function (Blueprint $table) {
            $table->id();
            $table->string('reimburse');
            $table->longText('url');
            $table->timestamps();

            $table->foreign('reimburse')->references('rn')->on('reimburses')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reimburse_attachments');
    }
};
