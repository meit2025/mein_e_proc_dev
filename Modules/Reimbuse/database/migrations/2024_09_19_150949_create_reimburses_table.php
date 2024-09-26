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
            $table->string('rn')->unique();
            $table->string('group');
            $table->string('type');
            $table->string('requester');
            $table->string('currency');
            $table->longText('remark');
            $table->double('balance');
            $table->date('receipt_date');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('period');
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('period')->references('code')->on('reimburse_periods')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('group')->references('code')->on('reimburse_groups')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('type')->references('code')->on('reimburse_types')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('requester')->references('nip')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
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
