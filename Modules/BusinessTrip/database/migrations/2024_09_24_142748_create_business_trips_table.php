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
        Schema::create('business_trips', function (Blueprint $table) {
            $table->id();
            $table->string('rn')->unique();
            $table->string('group');
            $table->string('requester');
            $table->foreignId('purpose_type')->constrained('purpose_types')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('shift');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('destination');
            $table->longText('remark');
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('shift')->references('code')->on('shifts')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreign('requester')->references('nip')->on('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreign('destination')->references('code')->on('destinations')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_trips');
    }
};
