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
        

        if (!Schema::hasTable('purchasing_groups')) {
            Schema::create('purchasing_groups', function (Blueprint $table) {
                $table->id();
                $table->string('purchasing_group')->nullable();
                $table->string('purchasing_group_desc')->nullable();

                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchasing_groups');
    }
};
