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
        Schema::create('master_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 12)->index();
            $table->string('desc', 40)->index();
            $table->string('order_type', 4)->index();
            $table->string('short_text', 40)->index();
            $table->string('company_code', 4)->index();
            $table->string('company_name', 25)->index();
            $table->string('profile_center', 10)->index();
            $table->string('long_text', 40)->index();
            $table->timestamps();
            $table->unique(['order_number'], 'order_number_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_orders');
    }
};
