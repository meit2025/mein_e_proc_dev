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
            $table->string('reimburse_type');
            $table->string('currency');
            $table->string('type');
            $table->string('for');
            $table->double('balance');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('period');

            $table->foreignId('purchasing_group')->constrained('purchasing_groups')->cascadeOnUpdate();
            $table->foreignId('tax_on_sales')->constrained('pajaks')->cascadeOnUpdate();
            $table->string('short_text'); // replace remark
            $table->date('item_delivery_data'); // replaced receipt_date
            $table->string('desired_vendor'); // requester
            $table->string('pembeda')->default('reim');
            $table->string('tracking_number')->nullable();
            $table->tinyInteger('item_number')->default(1);
            $table->string('purchase_requisition_document_type')->default('ZSUN');
            $table->string('valuation_type')->nullable();
            $table->string('purchase_requisition_closed')->nullable();
            $table->string('purchasing_organization')->default('1600');
            $table->char('account_assignment')->default('Y');
            $table->string('storage_location')->default('0001');
            $table->string('purchase_requisition_unit_of_measure')->nullable();
            $table->tinyInteger('purchase_requisition_quantity')->default(1);
            $table->string('item_category_in_purchasing_document')->nullable();
            $table->string('plant')->default('ID01');

            $table->softDeletes();
            $table->timestamps();

            $table->foreign('period')->references('code')->on('master_period_reimburses')->cascadeOnUpdate();
            $table->foreign('reimburse_type')->references('code')->on('master_type_reimburses')->cascadeOnUpdate();
            $table->foreign('desired_vendor')->references('nip')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('group')->references('code')->on('reimburse_groups')->cascadeOnDelete()->cascadeOnUpdate();
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
