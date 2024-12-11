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
        //
        Schema::table('units', function (Blueprint $table) {
            $table->string('material_number')->nullable()->change();
            $table->string('cost_center')->nullable()->change();
            $table->string('uom')->nullable()->change();
            $table->string('order_number')->nullable()->change();
            $table->string('asset_number')->nullable()->change();
            $table->string('sub_asset_number')->nullable()->change();
            $table->string('short_text')->nullable()->change();
            $table->string('short_text')->nullable()->change();
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
