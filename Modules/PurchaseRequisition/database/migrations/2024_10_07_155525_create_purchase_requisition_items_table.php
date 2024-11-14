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
        Schema::create('purchase_requisition_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purchase_requisition_id');
            $table->foreign('purchase_requisition_id')->references('id')->on('purchase_requisitions');
            $table->string('deletion_indicator')->nullable();
            $table->string('cost_center')->nullable();
            $table->string('item_number')->nullable();
            $table->string('purchase_requisition_number')->nullable();
            $table->string('order_number')->nullable();
            $table->string('asset_number')->nullable();
            $table->string('main_asset_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_requisition_items');
    }
};
