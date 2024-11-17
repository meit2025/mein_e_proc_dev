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
        Schema::create('entertainments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_id')->constrained()->onDelete('cascade');
            $table->string('header_not')->nullable(); // Header not
            $table->string('tanggal')->nullable(); // Date (tanggal)
            $table->string('tempat')->nullable(); // Place (tempat)
            $table->string('alamat')->nullable(); // Address (alamat)
            $table->string('jenis')->nullable(); // Type (jenis)
            $table->string('nama')->nullable(); // Name (nama)
            $table->string('posisi')->nullable(); // Position (posisi)
            $table->string('jenis_usaha')->nullable(); // Business type (jenis_usaha)
            $table->string('jenis_kegiatan')->nullable(); // Activity type (jenis_kegiatan)

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entertainments');
    }
};
