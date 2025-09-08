<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class permissionMigration extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $permissions = [
            // Dashboard
            'dashboard view',

            // Reimburse
            'reimburse create',
            'reimburse view',
            'reimburse update',
            'reimburse delete',

            // Business Trip
            'business trip request create',
            'business trip request view',
            'business trip request update',
            'business trip request delete',
            'business trip declaration create',
            'business trip declaration view',
            'business trip declaration update',
            'business trip declaration delete',

            // Purchase Requisition
            'purchase requisition create',
            'purchase requisition view',
            'purchase requisition update',
            'purchase requisition delete',

            // Setting
            'setting create',
            'setting view',
            'setting update',
            'setting delete',
            'secret create',
            'secret view',
            'secret update',
            'secret delete',
            'api view',
            'api create',
            'api update',
            'api delete',
            'approval create',
            'approval view',
            'approval update',
            'approval delete',
            'user create',
            'user view',
            'user update',
            'user delete',
            'role permission create',
            'role permission view',
            'role permission update',
            'role permission delete',
            'role create',
            'role view',
            'role update',
            'role delete',

            // Master SAP
            'master sap material create',
            'master sap material view',
            'master sap material update',
            'master sap material delete',
            'master sap asset create',
            'master sap asset view',
            'master sap asset update',
            'master sap asset delete',
            'master sap cost center create',
            'master sap cost center view',
            'master sap cost center update',
            'master sap cost center delete',
            'master sap internal order create',
            'master sap internal order view',
            'master sap internal order update',
            'master sap internal order delete',
            'master sap recon account create',
            'master sap recon account view',
            'master sap recon account update',
            'master sap recon account delete',
            'master sap bank key create',
            'master sap bank key view',
            'master sap bank key update',
            'master sap bank key delete',
            'master sap business partner create',
            'master sap business partner view',
            'master sap business partner update',
            'master sap business partner delete',

            // Master PR
            'master pr document type create',
            'master pr document type view',
            'master pr document type update',
            'master pr document type delete',
            'master pr valuation type create',
            'master pr valuation type view',
            'master pr valuation type update',
            'master pr valuation type delete',
            'master pr purchasing group create',
            'master pr purchasing group view',
            'master pr purchasing group update',
            'master pr purchasing group delete',
            'master pr account assignment category create',
            'master pr account assignment category view',
            'master pr account assignment category update',
            'master pr account assignment category delete',
            'master pr item category create',
            'master pr item category view',
            'master pr item category update',
            'master pr item category delete',
            'master pr storage location create',
            'master pr storage location view',
            'master pr storage location update',
            'master pr storage location delete',
            'master pr material group create',
            'master pr material group view',
            'master pr material group update',
            'master pr material group delete',
            'master pr uom create',
            'master pr uom view',
            'master pr uom update',
            'master pr uom delete',
            'master pr tax create',
            'master pr tax view',
            'master pr tax update',
            'master pr tax delete',

            // Master Business Trip
            'master business trip allowance category create',
            'master business trip allowance category view',
            'master business trip allowance category update',
            'master business trip allowance category delete',
            'master business trip allowance item create',
            'master business trip allowance item view',
            'master business trip allowance item update',
            'master business trip allowance item delete',
            'master business trip purpose type create',
            'master business trip purpose type view',
            'master business trip purpose type update',
            'master business trip purpose type delete',
            'master business trip grade create',
            'master business trip grade view',
            'master business trip grade update',
            'master business trip grade delete',
            'master business trip destination create',
            'master business trip destination view',
            'master business trip destination update',
            'master business trip destination delete',

            // Master Reimburse
            'master reimburse type create',
            'master reimburse type view',
            'master reimburse type update',
            'master reimburse type delete',
        ];

        // Insert permissions into database
        foreach ($permissions as $permission) {
            \Spatie\Permission\Models\Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }
    }
}
