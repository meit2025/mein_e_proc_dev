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
        // Procurement table
        Schema::create('procurements', function (Blueprint $table) {
            $table->id();
            $table->integer('const_center');
            $table->string('cost_center_budgeted');
            $table->string('transaction_budgeted');
            $table->string('vendor_remark');
            $table->boolean('vendor_selected_competitive_lowest_price');
            $table->boolean('vendor_selected_competitive_price');
            $table->boolean('vendor_selected_competitive_capable');
            $table->string('selected_vendor_remark');
            $table->timestamps();
        });

        // Vendors table
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('procurement_id')->constrained('procurements')->onDelete('cascade');
            $table->integer('vendor'); // Assuming vendor is a reference to a vendor ID
            $table->boolean('vendor_winner');
            $table->timestamps();
        });

        // Vendor Units table
        Schema::create('vendor_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendors')->onDelete('cascade');
            $table->decimal('unit_price', 15, 2);
            $table->decimal('total_amount', 15, 2);
            $table->string('other_criteria');
            $table->timestamps();
        });

        // Items table
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('procurement_id')->constrained('procurements')->onDelete('cascade');
            $table->string('material_number');
            $table->integer('qty');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
        Schema::dropIfExists('vendor_units');
        Schema::dropIfExists('vendors');
        Schema::dropIfExists('procurements');
    }
};
