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
        Schema::table('purchase_requisitions', function (Blueprint $table) {
            $table->text('header_not')->nullable()->default(null)->change();
        });

        Schema::table('entertainments', function (Blueprint $table) {
            $table->text('header_not')->nullable()->default(null)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('purchase_requisitions', function (Blueprint $table) {
            $table->string('header_not')->nullable()->default(null)->change();
        });

        Schema::table('entertainments', function (Blueprint $table) {
            $table->string('header_not')->nullable()->default(null)->change();
        });
    }
};
