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
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('main_asset_number', 50)->nullable(); // Main Asset Number
            $table->string('asset_subnumber', 50)->nullable(); // Asset Subnumber
            $table->string('order_number', 50)->nullable(); // Order Number
            $table->string('purchasing_document_number', 50)->nullable(); // Purchasing Document Number
            $table->string('item_number_of_purchasing_document', 50)->nullable(); // Item Number of Purchasing Document
            $table->string('cost_center', 50)->nullable(); // Cost Center
            $table->string('purchasing_document_date')->nullable(); // Purchasing Document Date
            $table->string('purchasing_document_type', 50)->nullable(); // Purchasing Document Type
            $table->string('company_code', 50)->nullable(); // Company Code
            $table->string('purchasing_group', 50)->nullable(); // Purchasing Group
            $table->string('purchasing_organization', 50)->nullable(); // Purchasing Organization
            $table->string('incoterms_part1', 50)->nullable(); // Incoterms (Part 1)
            $table->string('incoterms_part2', 50)->nullable(); // Incoterms (Part 2)
            $table->string('vendor_account_number', 50)->nullable(); // Vendor's Account Number
            $table->string('currency_key', 10)->nullable(); // Currency Key
            $table->string('terms_of_payment_key', 50)->nullable(); // Terms of Payment Key
            $table->string('requisitioner_name', 100)->nullable(); // Name of Requisitioner/Requester
            $table->string('purchase_requisition_number', 50)->nullable(); // Purchase Requisition Number
            $table->string('requirement_tracking_number', 50)->nullable(); // Requirement Tracking Number
            $table->string('item_number_of_purchase_requisition', 50)->nullable(); // Item Number of Purchase Requisition
            $table->string('delivery_completed_indicator')->nullable(); // "Delivery Completed" Indicator
            $table->string('final_invoice_indicator')->nullable(); // Final Invoice Indicator
            $table->string('account_assignment_category', 50)->nullable(); // Account Assignment Category
            $table->string('storage_location', 50)->nullable(); // Storage Location
            $table->string('deletion_indicator')->nullable(); // Deletion Indicator in Purchasing Document
            $table->string('material_group', 50)->nullable(); // Material Group
            $table->string('material_number', 50)->nullable(); // Material Number
            $table->string('po_unit_of_measure', 50)->nullable(); // Purchase Order Unit of Measure
            $table->string('po_quantity', 15, 2)->nullable(); // Purchase Order Quantity
            $table->string('tax_code', 10)->nullable(); // Tax Code
            $table->string('net_price', 15, 2)->nullable(); // Net Price in Document Currency
            $table->string('item_category', 50)->nullable(); // Item Category in Purchasing Document
            $table->string('invoice_receipt_indicator')->nullable(); // Invoice Receipt Indicator
            $table->string('short_text', 255)->nullable(); // Short Text
            $table->string('gr_based_invoice_verification')->nullable(); // GR-Based Invoice Verification Indicator
            $table->string('goods_receipt_indicator')->nullable(); // Goods Receipt Indicator
            $table->string('plant', 50)->nullable(); // Plant
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
        Schema::dropIfExists('purchase_orders');
    }
};
