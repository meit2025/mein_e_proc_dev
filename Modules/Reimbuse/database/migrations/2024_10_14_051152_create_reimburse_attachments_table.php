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

        if (!Schema::hasTable('reimburse_attachments')) {
            Schema::create('reimburse_attachments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('reimburse')->constrained('reimburses')->cascadeOnDelete()->cascadeOnUpdate();
                $table->longText('url');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reimburse_attachments');
    }
};
