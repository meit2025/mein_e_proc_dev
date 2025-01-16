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
        Schema::create('approval_conditional_users_to_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('approval_conditional_users_id');
            $table->unsignedBigInteger('user_id');
            $table->unique(['user_id', 'approval_conditional_users_id'], 'approval_to_approval_conditional_users_unique');
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('approval_conditional_users_id')->references('id')->on('approval_conditional_users')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_conditional_users_to_users');
    }
};
