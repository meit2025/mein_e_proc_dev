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
        Schema::create('master_assets', function (Blueprint $table) {
            $table->id();
            $table->string('company_code', 4)->index();
            $table->string('company_name', 25)->index();
            $table->string('asset', 12)->index();
            $table->string('asset_subnumber', 4)->index();
            $table->string('asset_class', 8)->index();
            $table->string('asset_class_desc', 50)->index();
            $table->string('desc', 50)->index();
            $table->string('inventory_number', 25)->index();
            $table->bigInteger('qty')->index();
            $table->string('base_unit_of_measure', 4)->index();

            $table->timestamps();
            $table->unique(['company_code', 'asset', 'asset_subnumber'], 'company_code_asset_asset_subnumber_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_assets');
    }
};
