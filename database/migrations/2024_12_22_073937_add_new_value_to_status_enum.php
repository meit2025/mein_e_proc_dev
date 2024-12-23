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
    public function up(): void
    {
        Schema::table('approvals', function (Blueprint $table) {
            DB::statement("ALTER TABLE approvals DROP CONSTRAINT approvals_status_check, ADD CONSTRAINT approvals_status_check CHECK ((status)::text = ANY ((ARRAY['Revise'::character varying, 'Approved'::character varying, 'Rejected'::character varying, 'Waiting'::character varying])::text[]));");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
