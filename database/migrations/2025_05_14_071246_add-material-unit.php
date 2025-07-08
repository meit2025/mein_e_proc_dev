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
        Unit::query()->chunk(100, function ($units) {
            // Hilangkan leading zero dari Unit::material_number (di PHP side)
            $normalizedUnitNumbers = $units->pluck('material_number')->map(function ($number) {
                return ltrim($number, '0');
            });

            MasterMaterial::whereIn(
                DB::raw("REGEXP_REPLACE(material_number, '^0+', '')"),
                $normalizedUnitNumbers
            )->chunk(100, function ($masterMaterials) use ($units) {
                foreach ($masterMaterials as $masterMaterial) {
                    $normalizedMaterialNumber = ltrim($masterMaterial->material_number, '0');

                    $matchedUnits = $units->filter(function ($u) use ($normalizedMaterialNumber) {
                        return ltrim($u->material_number, '0') === $normalizedMaterialNumber;
                    });

                    foreach ($matchedUnits as $unit) {
                        $unit->material_number_description = $masterMaterial->material_description;
                        $unit->save();
                    }
                }
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
