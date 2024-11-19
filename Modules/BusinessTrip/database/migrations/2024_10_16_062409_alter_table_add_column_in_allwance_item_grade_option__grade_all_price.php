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
        Schema::table('allowance_items', function(Blueprint $table) {
            $table->string('grade_option')->nullable();
            $table->float('grade_all_price')->default(0);


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('allowance_items', function (Blueprint $table) {
            $table->dropColumn('grade_option');
            $table->dropColumn('grade_all_price');
        });

    }
};
