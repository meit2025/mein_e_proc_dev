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
        Schema::create('reimburse_quotas', function (Blueprint $table) {
            $table->id();
            $table->string('user');
            $table->string('period');
            $table->string('type');
            $table->enum('grade', ['A', 'B', 'C', 'D', 'E']);
            $table->integer('limit')->nullable();
            $table->double('plafon')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('period')->references('code')->on('reimburse_periods')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreign('type')->references('code')->on('reimburse_types')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reimburse_quotas');
    }
};
