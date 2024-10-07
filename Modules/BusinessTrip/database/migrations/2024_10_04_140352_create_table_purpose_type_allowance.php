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
        Schema::create('purpose_type_allowances', function (Blueprint $table) {
            $table->id();
            $table->softDeletes();
            $table->unsignedBigInteger('purpose_type_id');
            $table->foreign('purpose_type_id')->references('id')->on('purpose_types')->onDelete('cascade');
            $table->unsignedBigInteger('allowance_items_id');
            $table->foreign('allowance_items_id')->references('id')->on('allowance_items')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('');
    }
};
