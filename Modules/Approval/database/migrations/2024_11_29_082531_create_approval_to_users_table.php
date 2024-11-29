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
        Schema::create('approval_to_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('approval_route_id');
            $table->timestamps();
            $table->unique(['user_id', 'approval_route_id'], 'approval_to_users_user_approval_routes_unique');

            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade');
            $table->foreign('approval_route_id')->references('id')->on('approval_routes')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_to_users');
    }
};
