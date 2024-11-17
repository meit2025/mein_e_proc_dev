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
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropColumn('account_assignment_categories');
        });

        Schema::table('units', function (Blueprint $table) {
            $table->string('account_assignment_categories')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('purchases', function (Blueprint $table) {
            $table->string('account_assignment_categories')->nullable();
        });

        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn('account_assignment_categories');
        });
    }
};
