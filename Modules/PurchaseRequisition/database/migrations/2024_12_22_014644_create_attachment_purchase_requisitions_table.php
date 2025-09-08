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
        Schema::create('attachment_purchase_requisitions', function (Blueprint $table) {
            $table->id();
            $table->string('file_name')->nullable();
            $table->string('file_path')->nullable();
            $table->foreignId('purchase_id')->constrained('purchases')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachment_purchase_requisitions');
    }
};
