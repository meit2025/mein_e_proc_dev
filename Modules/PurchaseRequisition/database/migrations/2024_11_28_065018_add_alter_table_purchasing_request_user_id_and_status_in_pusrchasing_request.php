<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */  public function up(): void
    {
        // Modifying the 'purchases' table
        Schema::table('purchases', function (Blueprint $table) {
            $table->unsignedBigInteger('status_id')->default(1);
            $table->unsignedBigInteger('createdBy')->nullable();
            $table->unsignedBigInteger('updatedBy')->nullable();

            $table->foreign('status_id')->references('id')->on('master_statuses')->onUpdate('cascade');
            $table->foreign('createdBy')->references('id')->on('users')->onUpdate('cascade');
            $table->foreign('updatedBy')->references('id')->on('users')->onUpdate('cascade');
        });

        // Checking and dropping columns in 'purchases'
        if (Schema::hasColumn('purchases', 'is_cashAdvance')) {
            Schema::table('purchases', function (Blueprint $table) {
                $table->dropColumn('is_cashAdvance');
            });
        }

        if (Schema::hasColumn('purchases', 'account_assignment_categories')) {
            Schema::table('purchases', function (Blueprint $table) {
                $table->dropColumn('account_assignment_categories');
            });
        }

        // Checking and dropping columns in 'purchase_requisitions'
        if (Schema::hasColumn('purchase_requisitions', 'status_id')) {
            Schema::table('purchase_requisitions', function (Blueprint $table) {
                $table->dropColumn('status_id');
            });
        }

        if (Schema::hasColumn('purchase_requisitions', 'user_id')) {
            Schema::table('purchase_requisitions', function (Blueprint $table) {
                $table->dropColumn('user_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverting changes to 'purchases' table
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropForeign(['status_id']);
            $table->dropColumn('status_id');
            $table->dropColumn('createdBy')->nullable();
            $table->dropColumn('updatedBy')->nullable();
        });

        // Adding dropped columns back in 'purchases'
        Schema::table('purchases', function (Blueprint $table) {
            $table->boolean('is_cashAdvance')->default(false);
            $table->string('account_assignment_categories')->nullable();
        });

        // Adding dropped columns back in 'purchase_requisitions'
        Schema::table('purchase_requisitions', function (Blueprint $table) {
            $table->unsignedBigInteger('status_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
        });
    }
};
