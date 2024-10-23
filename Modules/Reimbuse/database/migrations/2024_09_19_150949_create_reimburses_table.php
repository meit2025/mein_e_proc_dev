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
        Schema::create('reimburses', function (Blueprint $table) {
            $table->id();
            $table->string('group');
            $table->string('type');
            $table->string('currency');
            $table->string('remark'); // Short Text
            $table->string('for');
            $table->double('balance');
            $table->date('receipt_date'); // Item Delivery Date
            $table->date('start_date');
            $table->date('end_date');
            $table->string('period');

            $table->string('pembeda')->default('reim');
            $table->string('tracking_number')->nullable();
            $table->tinyInteger('item_number')->default(1);
            $table->string('purchase_requisition_document_type')->default('ZSUN');
            $table->string('valuation_type')->nullable();
            $table->string('purchase_requisition_closed')->nullable();
            $table->foreignId('purchasing_group')->constrained('purchasing_groups')->cascadeOnUpdate();
            $table->string('purchasing_organization')->default('1600');
            $table->char('account_assignment')->default('Y');
            $table->string('storage_location')->default('0001');
            $table->string('desired_vendor'); // requester
            $table->string('material_group');
            $table->string('material_number');
            $table->string('purchase_requisition_unit_of_measure');
            $table->tinyInteger('purchase_requisition_quantity')->default(1);
            $table->double('tax_on_sales')->default(0);
            $table->string('item_category_in_purchasing_document')->nullable();
            $table->string('plant')->default('ID01');

            $table->softDeletes();
            $table->timestamps();

            $table->foreign('period')->references('code')->on('reimburse_periods')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('group')->references('code')->on('reimburse_groups')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('type')->references('code')->on('reimburse_types')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('currency')->references('code')->on('currencies')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reimburses');
    }
};
