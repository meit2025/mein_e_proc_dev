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
        Schema::dropIfExists('purchase_requisition_items');
        Schema::dropIfExists('purchase_requisition_details');
        Schema::dropIfExists('purchase_requisitions');

        Schema::create('purchase_requisitions', function (Blueprint $table) {
            $table->id();
            $table->string('purchase_id');
            $table->string('requisitioner_name');
            $table->string('requisition_date');
            $table->string('purchase_requisition_number')->unique();
            $table->string('requirement_tracking_number')->nullable();
            $table->string('item_number')->nullable();
            $table->string('document_type')->nullable();
            $table->string('valuation_type')->nullable();
            $table->string('is_closed')->nullable();
            $table->string('purchasing_group')->nullable();
            $table->string('purchasing_organization')->nullable();
            $table->string('account_assignment_category')->nullable();
            $table->string('item_delivery_date')->nullable();
            $table->string('storage_location')->nullable();
            $table->string('desired_vendor')->nullable();
            $table->string('material_group')->nullable();
            $table->string('material_number')->nullable();
            $table->string('unit_of_measure')->nullable();
            $table->integer('quantity');
            $table->string('tax_code')->nullable();
            $table->string('item_category')->nullable();
            $table->string('short_text')->nullable();
            $table->string('plant')->nullable();
            $table->string('deletion_indicator')->nullable();
            $table->string('cost_center')->nullable();
            $table->string('order_number')->nullable();
            $table->string('asset_subnumber')->nullable();
            $table->string('main_asset_number')->nullable();
            $table->string('code_transaction')->nullable();

            $table->string('header_not')->nullable(); // Header not
            $table->string('tanggal_entertainment')->nullable(); // Date (tanggal)
            $table->string('tempat_entertainment')->nullable(); // Place (tempat)
            $table->string('alamat_entertainment')->nullable(); // Address (alamat)
            $table->string('jenis_entertainment')->nullable(); // Type (jenis)
            $table->string('nama_entertainment')->nullable(); // Name (nama)
            $table->string('posisi_entertainment')->nullable(); // Position (posisi)
            $table->string('jenis_usaha_entertainment')->nullable(); // Business type (jenis_usaha)
            $table->string('jenis_kegiatan_entertainment')->nullable(); // Activity type (jenis_kegiatan)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('purchase_requisitions');
        // Then drop the dependent tables
        Schema::dropIfExists('purchase_requisition_items');
        Schema::dropIfExists('purchase_requisition_details');
    }
};
