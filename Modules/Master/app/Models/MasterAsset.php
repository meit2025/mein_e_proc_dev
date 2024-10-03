<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterAssetFactory;

class MasterAsset extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'company_code',
        'company_name',
        'asset',
        'asset_subnumber',
        'asset_class',
        'asset_class_desc',
        'desc',
        'inventory_number',
        'qty',
        'base_unit_of_measure',
        'delete'
    ];

    // protected static function newFactory(): MasterAssetFactory
    // {
    //     // return MasterAssetFactory::new();
    // }
}
