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
            $table->string('clearing_status')->nullable()->default(null);
            $table->string('clearing_number')->nullable()->default(null);
            $table->date('clearing_date')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('purchase_requisitions', function (Blueprint $table) {
            $table->dropColumn('clearing_status');
            $table->dropColumn('clearing_number');
            $table->dropColumn('clearing_date');
        });
    }
};
