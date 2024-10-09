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
        Schema::create('purchase_requisitions', function (Blueprint $table) {
            $table->id();
            $table->string('pr_number');
            $table->string('item_number');
            $table->string('deletion_indicator');
            $table->string('requester_by');
            $table->date('request_date');
            $table->string('tracking_number');
            $table->integer('document_type_id');
            $table->integer('valuation_type_id');
            $table->string('purchase_requisition_closed');
            $table->integer('purchasing_group_id');
            $table->string('purchasing_organization');
            $table->integer('account_assignment_category_id');
            $table->date('item_delivery_date');
            $table->integer('storage_location_id');
            $table->string('desired_vendor');
            $table->integer('material_group_id');
            $table->string('material_number');
            $table->integer('purchase_requisition_unit');
            $table->integer('purchase_requisition_quantity');
            $table->integer('pajak_id');
            $table->string('item_category')->nullable();
            $table->string('short_text')->nullable();
            $table->string('plant')->nullable();
            $table->string('status')->nullable();
            $table->string('code')->nullable();
            $table->string('message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_requisitions');
    }
};
