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
        Schema::table('reimburses', function (Blueprint $table) {
            //
            $table->string('requester')->change()->nullable();
            $table->foreign('requester')->references('nip')->on('users')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reimburses', function (Blueprint $table) {
            //
            $table->integer('requester')->change();
        });
    }
};
