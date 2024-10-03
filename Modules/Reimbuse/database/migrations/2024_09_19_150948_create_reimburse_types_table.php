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
        Schema::create('reimburse_types', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string("group")->nullable();
            $table->string('name');
            $table->boolean('is_employee');
            $table->integer('claim_limit')->nullable();
            $table->double('plafon')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reimburse_types');
    }
};
