<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Modules\Master\Models\MasterMaterial;
use Modules\PurchaseRequisition\Models\Unit;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        // material_number_description

        Schema::table('units', function (Blueprint $table) {
            $table->string('material_number_description')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn('material_number_description')->nullable();
        });
    }
};
