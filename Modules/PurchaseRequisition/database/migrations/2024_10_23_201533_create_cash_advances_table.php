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
        Schema::create('cash_advances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_id')->constrained()->onDelete('cascade');
            $table->string('company_code')->default('1600');
            $table->string('document_type')->default('VD');
            $table->string('currency')->default('IDR');
            $table->string('document_date')->nullable();
            $table->string('reference')->nullable();
            $table->string('document_header_text')->nullable();
            $table->string('item')->default('1');
            $table->string('posting_key')->default('39');
            $table->string('gl_indicator')->default('F');
            $table->string('target_spesial')->default('C');
            $table->string('vendor_code');
            $table->string('amount');
            $table->string('amount_local_currency');
            $table->string('tax_amount');
            $table->string('tax_code');
            $table->string('due_on')->nullable();
            $table->string('payment_method')->default('T');
            $table->string('purchasing_document')->nullable();
            $table->string('purchasing_document_item')->nullable()->default('1');
            $table->string('assigment');
            $table->string('text')->nullable();
            $table->string('profit_center');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_advances');
    }
};
