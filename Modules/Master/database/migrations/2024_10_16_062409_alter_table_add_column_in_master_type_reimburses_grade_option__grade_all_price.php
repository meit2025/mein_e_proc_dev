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
        // Schema::table('master_type_reimburses', function(Blueprint $table) {
        //     $table->string('grade_option')->nullable()->after('material_number');
        //     $table->float('grade_all_price')->default(0)->after('grade_option');
        //     $table->dropColumn('grade');
        //     $table->dropColumn('plafon');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('master_type_reimburses', function (Blueprint $table) {
            $table->dropColumn('grade_option');
            $table->dropColumn('grade_all_price');
        });
    }
};
