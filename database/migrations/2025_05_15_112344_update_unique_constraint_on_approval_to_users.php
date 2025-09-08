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
        Schema::table('approval_to_users', function (Blueprint $table) {
            // Hapus constraint lama
            $table->dropUnique('approval_to_users_user_approval_routes_unique');

            // Tambah constraint baru
            $table->unique(['user_id', 'approval_route_id', 'is_reim', 'is_bt'], 'approval_to_users_unique_with_flags');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('approval_to_users', function (Blueprint $table) {
            // Hapus constraint baru
            $table->dropUnique('approval_to_users_unique_with_flags');

            // Tambahkan kembali constraint lama
            $table->unique(['user_id', 'approval_route_id'], 'approval_to_users_user_approval_routes_unique');
        });
    }
};
