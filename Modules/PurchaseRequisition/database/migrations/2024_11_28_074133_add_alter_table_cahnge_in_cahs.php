<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change the column type to bigint using raw SQL
        DB::statement('ALTER TABLE cash_advance_purchases ALTER COLUMN unit_id TYPE bigint USING unit_id::bigint');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert the column type back to integer using raw SQL
        DB::statement('ALTER TABLE cash_advance_purchases ALTER COLUMN unit_id TYPE integer USING unit_id::integer');
    }
};
