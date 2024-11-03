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
        Schema::create('master_quota_reimburses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user')->constrained('users')->cascadeOnUpdate();
            $table->foreignId('period')->constrained('master_period_reimburses')->cascadeOnUpdate();
            $table->foreignId('type')->constrained('master_type_reimburses')->cascadeOnUpdate();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_quota_reimburses');
    }
};
