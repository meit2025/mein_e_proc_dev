<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        Permission::create(['name' => 'approval conditional user view', 'guard_name' => 'web']);
        Permission::create(['name' => 'approval conditional user create', 'guard_name' => 'web']);
        Permission::create(['name' => 'approval conditional user delete', 'guard_name' => 'web']);
        Permission::create(['name' => 'approval conditional user update', 'guard_name' => 'web']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Permission::whereIn('name', [
            'approval conditional user view',
            'approval conditional user create',
            'approval conditional user delete',
            'approval conditional user update',
        ])->delete();
    }
};
