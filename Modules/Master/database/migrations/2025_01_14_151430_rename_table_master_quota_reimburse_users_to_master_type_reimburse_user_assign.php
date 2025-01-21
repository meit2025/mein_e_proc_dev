<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        DB::table('master_quota_reimburse_users')->truncate();
        Schema::rename('master_quota_reimburse_users', 'master_type_reimburse_user_assign');

        Schema::table('master_type_reimburse_user_assign', function (Blueprint $table) {
            $table->renameColumn('quota_reimburses_id', 'reimburse_type_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

    }
};
