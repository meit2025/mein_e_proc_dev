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
        Schema::create('master_cost_centers', function (Blueprint $table) {
            $table->id();
            $table->string('controlling_area', 4)->index();
            $table->string('controlling_name', 25)->index();
            $table->string('cost_center', 10)->index();
            $table->string('valid_form', 10)->index();
            $table->string('valid_to', 10)->index();
            $table->string('company_code', 4)->index();
            $table->string('company_name', 25)->index();
            $table->string('desc', 40)->index();
            $table->string('standard_hierarchy_area', 12)->index();
            $table->string('short_desc_set', 40)->index();
            $table->string('profile_center', 10)->index();
            $table->string('long_text', 40)->index();
            $table->timestamps();
            $table->unique(['controlling_area', 'cost_center', 'valid_to'], 'valid_to_cost_center_controlling_area_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_cost_centers');
    }
};
