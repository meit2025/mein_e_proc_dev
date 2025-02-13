<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('exchange_rates', function (Blueprint $table) {
            $table->id();
            $table->string('worklist')->nullable()->default(null);
            $table->string('er')->nullable()->default('M');
            $table->string('from')->nullable()->default(null);
            $table->string('to')->nullable()->default(null);
            $table->string('relation')->nullable()->default(null);
            $table->date('last_date')->nullable()->default(null);
            $table->string('old_er')->nullable()->default(null);
            $table->float('tolerance')->nullable()->default(0);
            $table->timestamps();   
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exchange_rate');
    }
};
