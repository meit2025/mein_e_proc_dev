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
        Schema::create('approval_prs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('document_type_id')->nullable();
            $table->string('dscription');
            $table->boolean('is_condition')->default(false);
            $table->enum('condition_type', ['>', '<', '=', '>=', '<=', 'range'])->nullable();
            $table->string('min_value')->default(0);
            $table->string('max_value')->default(0);
            $table->string('value')->default(0);

            $table->unsignedBigInteger('master_division_id')->nullable();
            $table->unsignedBigInteger('purchasing_group_id')->nullable();
            $table->unsignedBigInteger('master_tracking_number_id')->nullable();


            $table->foreign('document_type_id')
                ->references('id')
                ->on('document_types')
                ->onDelete('set null');

            $table->foreign('master_division_id')
                ->references('id')
                ->on('master_divisions')
                ->onDelete('set null');


            $table->foreign('purchasing_group_id')
                ->references('id')
                ->on('purchasing_groups')
                ->onDelete('set null');

            $table->foreign('master_tracking_number_id')
                ->references('id')
                ->on('master_tracking_numbers')
                ->onDelete('set null');




            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_prs');
    }
};
