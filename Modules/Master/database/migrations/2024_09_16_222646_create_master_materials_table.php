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
        Schema::create('master_materials', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('old_material_number', 40)->nullable()->index(); // Nullable with an index
            $table->string('external_material_group', 18)->index(); // Indexed
            $table->string('material_group', 9)->index(); // Indexed
            $table->string('material_number', 80)->index(); // Indexed
            $table->string('industry'); // Industry without a length specification (default will be 255)
            $table->bigInteger('base_unit_of_measure'); // Big integer, no length (removed the invalid length)
            $table->string('material_type', 4); // String with a length of 4
            $table->string('material_description', 40)->index(); // Indexed
            $table->string('plant_specific_material_status', 4)->nullable()->index(); // Nullable with index
            $table->string('material_status_valid', 10)->nullable()->index(); // Nullable with index
            $table->string('plant', 8)->index(); // Indexed
            $table->timestamps(); // Timestamps for created_at and updated_at

            // Unique constraint for plant and material_number
            $table->unique(['plant', 'material_number'], 'plant_material_number_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_materials');
    }
};
