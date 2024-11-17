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
        Schema::create('data_dropdowns', function (Blueprint $table) {
            $table->id();
            $table->string('doc_id');
            $table->string('dropdown_type');
            $table->string('tabel_name');
            $table->string('field_name');
            $table->text('data_dropdown');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_dropdowns');
    }
};
