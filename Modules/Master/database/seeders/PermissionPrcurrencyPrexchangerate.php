<?php

namespace Modules\Master\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Master\Models\MasterOrder;
use Spatie\Permission\Models\Permission;

class PermissionPrcurrencyPrexchangerate extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'master pr currency create',
            'master pr currency view',
            'master pr currency update',
            'master pr currency delete',
            'master pr exchange rate create',
            'master pr exchange rate view',
            'master pr exchange rate update',
            'master pr exchange rate delete',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }
    }
}
