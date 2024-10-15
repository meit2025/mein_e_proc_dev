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
        Schema::create('approval_routes', function (Blueprint $table) {
            $table->id();
            $table->string('group_id')->unique()->index();
            $table->boolean('is_hr');
            $table->enum('hr_approval', ['start', 'end'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_routes');
    }
};
