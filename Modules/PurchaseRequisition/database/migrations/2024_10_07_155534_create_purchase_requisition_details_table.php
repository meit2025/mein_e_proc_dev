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
        Schema::create('purchase_requisition_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purchase_requisition_id');
            $table->foreign('purchase_requisition_id')->references('id')->on('purchase_requisitions');
            $table->date('date_entertaiment');
            $table->string('place_entertaiment');
            $table->string('address_entertaiment');
            $table->string('type_entertaiment');
            $table->string('name_dientertained');
            $table->string('position_dientertained');
            $table->string('name_company');
            $table->string('type_business');
            $table->string('type_activity');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_requisition_details');
    }
};
