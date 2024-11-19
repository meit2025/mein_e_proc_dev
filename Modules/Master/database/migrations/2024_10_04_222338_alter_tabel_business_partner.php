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
        Schema::table('master_business_partners', function (Blueprint $table) {
            $table->string('supplier_account_number');  // Account Number of Supplier
            $table->string('reconciliation_account');             // Reconciliation Account in General Ledger
            $table->string('company_code');                       // Company Code
            $table->string('payment_terms_credit_memos')->nullable();  // Payment Terms Key for Credit Memos
            $table->string('house_bank_short_key')->nullable();    // Short Key for a House Bank
            $table->string('head_office_account_number')->nullable();  // Head Office Account Number
            $table->string('central_deletion_flag')->default(0);  // Central Deletion Flag for Master Record
            $table->string('double_invoice_check_flag')->default(0); // Check Flag for Double Invoices or Credit Memos
            $table->string('tolerance_group')->nullable();         // Tolerance Group for Business Partner/G/L Account
            $table->string('payment_block_key')->nullable();       // Block Key for Payment
            $table->string('sorting_assignment_key')->nullable();  // Key for sorting according to assignment numbers
            $table->text('respected_payment_methods')->nullable(); // List of Respected Payment Methods
            $table->string('vendor_account_number')->nullable();   // Our account number with the vendor
            $table->string('purchasing_organization')->nullable(); // Purchasing Organization
            $table->string('incoterms_part_1')->nullable();        // Incoterms (Part 1)
            $table->string('incoterms_part_2')->nullable();        // Incoterms (Part 2)
            $table->string('calculation_schema_group')->nullable(); // Group for Calculation Schema (Supplier)
            $table->string('auto_po_allowed');        // Automatic Generation of Purchase Order Allowed
            $table->string('indicates_returns_supplier')->default(0);    // Indicates whether supplier is returns supplier
            $table->string('abc_indicator')->nullable();           // ABC indicator
            $table->string('central_deletion_flag_master_record')->default(0); // Central Deletion Flag for Master Record
            $table->string('central_purchasing_block')->default(0); // Centrally imposed purchasing block
            $table->string('responsible_salesperson')->nullable(); // Responsible Salesperson at Supplier's Office
            $table->string('shipping_conditions')->nullable();     // Shipping Conditions
            $table->string('currency_key')->nullable();            // Currency Key
            $table->string('gr_invoice_verification')->default(0); // Indicator: GR-Based Invoice Verification
            $table->string('payment_terms_key')->nullable();       // Terms of Payment Key
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
