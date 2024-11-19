<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MaterialGroupFactory;

class MaterialGroup extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'material_group',
        'material_group_desc',
    ];

    // protected static function newFactory(): MaterialGroupFactory
    // {
    //     // return MaterialGroupFactory::new();
    // }
}
