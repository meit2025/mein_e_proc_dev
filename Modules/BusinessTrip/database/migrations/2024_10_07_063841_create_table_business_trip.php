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
        Schema::create('business_trip', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purpose_type_id');
            $table->string('request_no')->nullable();
            $table->unsignedBigInteger('request_for');
            $table->unsignedBigInteger('created_by');
            $table->text('remarks');
            $table->integer('total_destination');
            $table->softDeletes();
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
