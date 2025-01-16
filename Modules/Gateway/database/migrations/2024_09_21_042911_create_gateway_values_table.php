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
        Schema::create('gateway_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gateways_id') // Menggunakan foreignId untuk relasi
                ->constrained('gateways') // Menentukan tabel yang dirujuk
                ->onDelete('cascade');
            $table->string('column_value');
            $table->string('value');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gateway_values');
    }
};
