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
        Schema::table('vendors', function (Blueprint $table) {
            //
            $table->bigInteger('purchase_id')->nullable()->change();
            $table->string('vendor_name_text')->nullable();
            $table->string('type_vendor')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            //
            $table->string('purchase_id')->change();
            $table->dropColumn('vendor_name_text');
            $table->dropColumn('type_vendor');
        });
    }
};
