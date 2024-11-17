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
        Schema::table('master_materials', function (Blueprint $table) {
            $table->string('plant_specific_material_status', 20)->change(); // Nullable with index
            $table->string('material_type', 20)->change(); // String with a length of 4
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('master_materials', function (Blueprint $table) {
            $table->string('plant_specific_material_status', 4)->change(); // Nullable with index
            $table->string('material_type', 4)->change(); // String with a length of 4
        });
    }
};
