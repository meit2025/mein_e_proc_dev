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
        //
        Schema::table('approval_routes', function (Blueprint $table) {
            $table->boolean('is_bt')->default(false);
            $table->boolean('is_reim')->default(false);
            $table->integer('day')->nullable();
            $table->boolean('is_restricted_area')->default(false);
        });

        Schema::table('approval_to_users', function (Blueprint $table) {
            $table->boolean('is_bt')->default(false);
            $table->boolean('is_reim')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('approval_routes', function (Blueprint $table) {
            $table->dropColumn('is_bt');
            $table->dropColumn('is_reim');
            $table->dropColumn('day');
            $table->dropColumn('is_restricted_area');
        });

        Schema::table('approval_to_users', function (Blueprint $table) {
            $table->dropColumn('is_bt');
            $table->dropColumn('is_reim');
        });
    }
};
