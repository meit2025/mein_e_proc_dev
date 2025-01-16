<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterMaterialFactory;

class MasterMaterial extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'old_material_number',
        'external_material_group',
        'material_group',
        'material_number',
        'industry',
        'base_unit_of_measure',
        'material_type',
        'material_description',
        'plant_specific_material_status',
        'material_status_valid',
        'plant',
        'delete'
    ];

    // protected static function newFactory(): MasterMaterialFactory
    // {
    //     // return MasterMaterialFactory::new();
    // }
}
