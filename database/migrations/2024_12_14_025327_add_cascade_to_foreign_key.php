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
            // Hapus foreign key lama jika sudah ada
            $table->dropForeign(['approval_route_id']);

            // Tambahkan kembali foreign key dengan ON DELETE CASCADE
            $table->foreign('approval_route_id')
                ->references('id')
                ->on('approval_routes')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
