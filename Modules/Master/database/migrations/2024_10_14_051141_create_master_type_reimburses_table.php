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
        Schema::dropIfExists('master_type_reimburses');
        Schema::create('master_type_reimburses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->boolean('is_employee');
            $table->integer('limit')->nullable();
            $table->double('plafon')->nullable();
            $table->string('material_group');
            $table->string('material_number');
            $table->foreignId('grade')->constrained('business_trip_grades')->cascadeOnUpdate();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_type_reimburses');
    }
};
