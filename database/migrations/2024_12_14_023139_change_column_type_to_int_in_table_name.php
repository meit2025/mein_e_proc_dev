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
        // Schema::table('approval_prs', function (Blueprint $table) {
        //     //
        //     $table->bigInteger('value')->change()->default(0);
        //     $table->bigInteger('min_value')->change()->default(0);
        //     $table->bigInteger('max_value')->change()->default(0);
        // });

        DB::statement("ALTER TABLE approval_prs ALTER COLUMN value DROP DEFAULT");
        DB::statement("ALTER TABLE approval_prs ALTER COLUMN min_value DROP DEFAULT");
        DB::statement("ALTER TABLE approval_prs ALTER COLUMN max_value DROP DEFAULT");

        // Gunakan SQL mentah untuk mengubah tipe kolom
        DB::statement('ALTER TABLE approval_prs ALTER COLUMN value TYPE BIGINT USING value::BIGINT');
        DB::statement('ALTER TABLE approval_prs ALTER COLUMN min_value TYPE BIGINT USING min_value::BIGINT');
        DB::statement('ALTER TABLE approval_prs ALTER COLUMN max_value TYPE BIGINT USING max_value::BIGINT');

        // Atur default dan non-null secara terpisah
        DB::statement('ALTER TABLE approval_prs ALTER COLUMN value SET DEFAULT 0');
        DB::statement('ALTER TABLE approval_prs ALTER COLUMN min_value SET DEFAULT 0');
        DB::statement('ALTER TABLE approval_prs ALTER COLUMN max_value SET DEFAULT 0');
        DB::statement('ALTER TABLE approval_prs ALTER COLUMN value SET NOT NULL');

        DB::statement("ALTER TABLE approval_routes ALTER COLUMN nominal DROP DEFAULT");
        DB::statement('ALTER TABLE approval_routes ALTER COLUMN nominal TYPE BIGINT USING nominal::BIGINT');
        DB::statement('ALTER TABLE approval_routes ALTER COLUMN nominal SET DEFAULT 0');
        DB::statement('ALTER TABLE approval_routes ALTER COLUMN nominal SET NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
