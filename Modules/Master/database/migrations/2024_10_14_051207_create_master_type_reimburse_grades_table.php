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
        // Schema::create('master_type_reimburse_grades', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('grade_id')->constrained('business_trip_grades')->cascadeOnUpdate();
        //     $table->foreignId('reimburse_type_id')->constrained('master_type_reimburses')->cascadeOnUpdate();
        //     $table->float('plafon')->default(0);
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_type_reimburse_grades');
    }
};
