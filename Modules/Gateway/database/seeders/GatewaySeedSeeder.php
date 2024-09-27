<?php

namespace Modules\Gateway\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Gateway\Models\Gateway;
use Modules\Gateway\Models\GatewayValue;

class GatewaySeedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // (type)::text = ANY ((ARRAY['get'::character varying, 'create'::character varying, 'update'::character varying, 'createOrUpdate'::character varying])::text[])
        // (methods)::text = ANY ((ARRAY['get'::character varying, 'post'::character varying])::text[])
        // $this->call([]);
        $data = [
            [
                'code_endpoint' => 'master_asset',
                'name' => 'Asset',
                'tabel_name' => 'master_assets',
                'methods' => 'post',
                'desc' => 'sync sap master assets',
                'command' => '-',
                'is_status' => true,
                'type' => 'createOrUpdate',
                'value' => [
                    [
                        'column_value' => 'company_code',
                        'value' => 'bukrs',
                        'is_key' => true,
                    ],
                    [
                        'column_value' => 'company_name',
                        'value' => 'butxt',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'asset',
                        'value' => 'anln1',
                        'is_key' => true,
                    ],
                    [
                        'column_value' => 'asset_subnumber',
                        'value' => 'anln2',
                        'is_key' => true,
                    ],
                    [
                        'column_value' => 'asset_class',
                        'value' => 'anlkl',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'asset_class_desc',
                        'value' => 'txk50',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'desc',
                        'value' => 'txt50',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'inventory_number',
                        'value' => 'invnr',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'qty',
                        'value' => 'menge',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'base_unit_of_measure',
                        'value' => 'meins',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'delete',
                        'value' => 'xloev',
                        'is_key' => false,
                    ],
                ]
            ],
            [
                'code_endpoint' => 'bank_key',
                'name' => 'Bank Key',
                'tabel_name' => 'master_bank_keys',
                'methods' => 'post',
                'desc' => 'sync bank key',
                'command' => '-',
                'is_status' => true,
                'type' => 'createOrUpdate',
                'value' => [
                    [
                        'column_value' => 'region_key',
                        'value' => 'banks',
                        'is_key' => true,
                    ],
                    [
                        'column_value' => 'bank_keys',
                        'value' => 'bankl',
                        'is_key' => true,
                    ],
                    [
                        'column_value' => 'name_financial_institution',
                        'value' => 'banka',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'city',
                        'value' => 'ort01',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'street_house_number',
                        'value' => 'stras',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'bank_branch',
                        'value' => 'brnch',
                        'is_key' => false,
                    ],
                ]
            ],
            [
                'code_endpoint' => 'master_cost_centers',
                'name' => 'Cost Center',
                'tabel_name' => 'master_cost_centers',
                'methods' => 'post',
                'desc' => 'sync master cost center',
                'command' => '-',
                'is_status' => true,
                'type' => 'createOrUpdate',
                'value' => [
                    [
                        'column_value' => 'controlling_area',
                        'value' => 'kokrs',
                        'is_key' => true,
                    ],
                    [
                        'column_value' => 'controlling_name',
                        'value' => 'bezei',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'cost_center',
                        'value' => 'kostl',
                        'is_key' => true,
                    ],
                    [
                        'column_value' => 'valid_form',
                        'value' => 'datab',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'valid_to',
                        'value' => 'datbi',
                        'is_key' => true,
                    ],
                    [
                        'column_value' => 'company_code',
                        'value' => 'bukrs',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'company_name',
                        'value' => 'butxt',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'desc',
                        'value' => 'ltext1',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'standard_hierarchy_area',
                        'value' => 'khinr',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'short_desc_set',
                        'value' => 'descript',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'profile_center',
                        'value' => 'prctr',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'long_text',
                        'value' => 'ltext2',
                        'is_key' => false,
                    ],
                ],
            ],
            [
                'code_endpoint' => 'master_materials',
                'name' => 'Master Material',
                'tabel_name' => 'master_materials',
                'methods' => 'post',
                'desc' => 'sync master Master Material',
                'command' => '-',
                'is_status' => true,
                'type' => 'createOrUpdate',
                'value' => [
                    [
                        'column_value' => 'material_number',
                        'value' => 'matnr',
                        'is_key' => true,
                    ],
                    [
                        'column_value' => 'plant',
                        'value' => 'werks',
                        'is_key' => true,
                    ],
                    [
                        'column_value' => 'industry',
                        'value' => 'mbrsh',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'material_type',
                        'value' => 'mtart',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'base_unit_of_measure',
                        'value' => 'meins',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'material_description',
                        'value' => 'maktx',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'old_material_number',
                        'value' => 'bismt',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'external_material_group',
                        'value' => 'extwg',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'material_group',
                        'value' => 'matkl',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'delete',
                        'value' => 'lvorm',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'plant_specific_material_status',
                        'value' => 'mmstd',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'material_status_valid',
                        'value' => 'mmsta',
                        'is_key' => false,
                    ],
                ]
            ],
            [
                'code_endpoint' => 'master_orders',
                'name' => 'Master Order',
                'tabel_name' => 'master_orders',
                'methods' => 'post',
                'desc' => 'sync master Master Order',
                'command' => '-',
                'is_status' => true,
                'type' => 'createOrUpdate',
                'value' => [
                    [
                        'column_value' => 'order_number',
                        'value' => 'aufnr',
                        'is_key' => true,
                    ],
                    [
                        'column_value' => 'desc',
                        'value' => 'ktext',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'order_type',
                        'value' => 'auart',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'short_text',
                        'value' => 'txt',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'company_code',
                        'value' => 'bukrs',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'company_name',
                        'value' => 'butxt',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'profile_center',
                        'value' => 'prctr',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'long_text',
                        'value' => 'ltext',
                        'is_key' => false,
                    ],
                ]
            ],
            [
                'code_endpoint' => 'master_reconts',
                'name' => 'Master Recon',
                'tabel_name' => 'master_reconts',
                'methods' => 'post',
                'desc' => 'sync master Master Recon',
                'command' => '-',
                'is_status' => true,
                'type' => 'createOrUpdate',
                'value' => [
                    [
                        'column_value' => 'account',
                        'value' => 'racct',
                        'is_key' => true,
                    ],
                    [
                        'column_value' => 'recon_acc',
                        'value' => 'koart',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'desc',
                        'value' => 'descr',
                        'is_key' => false,
                    ],
                    [
                        'column_value' => 'account_long_text',
                        'value' => 'txt50',
                        'is_key' => false,
                    ],
                ]
            ]
        ];

        foreach ($data as $key => $value) {
            // Prepare the 'value' field as JSON string
            $insertValues = $value['value'];  // Extract the 'value' array
            unset($value['value']);  // Remove it from the main insert array

            // Insert data into Gateway table
            $dataInsert = Gateway::create($value);

            // Insert each entry in the 'value' array into the GatewayValue table
            foreach ($insertValues as $v) {
                $v['gateways_id'] = $dataInsert->id;  // Add foreign key
                GatewayValue::create($v);  // Insert into GatewayValue
            }
        }
    }
}
