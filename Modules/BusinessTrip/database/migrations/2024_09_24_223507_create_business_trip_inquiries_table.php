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
        Schema::create('business_trip_inquiries', function (Blueprint $table) {
            $table->uuid('code')->primary();
            $table->string('name');
            $table->string('destination');
            $table->longText('description')->nullable();
            $table->string('currency');
            $table->double('plafon')->nullable();
            $table->date('start_period')->nullable();
            $table->date('end_period')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('destination')->references('code')->on('destinations')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreign('currency')->references('code')->on('currencies')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_trip_inquiries');
    }
};
