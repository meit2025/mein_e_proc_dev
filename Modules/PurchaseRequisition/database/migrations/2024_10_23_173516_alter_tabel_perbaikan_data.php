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
        Schema::dropIfExists('items');
        Schema::dropIfExists('vendor_units');
        Schema::dropIfExists('vendors');
        Schema::dropIfExists('procurements');

        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('document_type');
            $table->string('purchasing_groups');
            $table->string('account_assignment_categories');
            $table->date('delivery_date');
            $table->string('storage_locations');
            $table->integer('total_vendor');
            $table->integer('total_item');
            $table->timestamps();
        });

        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_id')->constrained()->onDelete('cascade');
            $table->integer('vendor');
            $table->boolean('winner');
            $table->timestamps();
        });

        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained()->onDelete('cascade');
            $table->string('cost_center');
            $table->string('material_group');
            $table->string('material_number');
            $table->string('uom');
            $table->integer('qty');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->string('tax');
            $table->string('short_text');
            $table->string('order_number');
            $table->string('asset_number');
            $table->string('sub_asset_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('units');
        Schema::dropIfExists('vendors');
        Schema::dropIfExists('purchases');
    }
};
