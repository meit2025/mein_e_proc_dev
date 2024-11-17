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
        Schema::create('allowance_items', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->float('fixed_value')->nullable();
            $table->float('max_value')->nullable();
            $table->string('request_value');
            $table->text('formula')->nullable();
            $table->unsignedBigInteger('currency_id');
            $table->unsignedBigInteger('allowance_category_id');
            $table->string('code')->unique();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allowance_items');
    }
};
