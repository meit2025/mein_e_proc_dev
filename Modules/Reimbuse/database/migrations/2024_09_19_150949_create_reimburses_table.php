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
        Schema::create('reimburses', function (Blueprint $table) {
            $table->id();
            $table->string('rn')->unique();
            $table->string('group');
            $table->foreignId('type')->constrained('reimburse_types')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('requester')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->longText('remark');
            $table->double('balance');
            $table->integer('claim_limit')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reimburses');
    }
};
