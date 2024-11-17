<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\UomFactory;

class Uom extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'internal_uom',
        'iso_code',
        'commercial',
        'measurement_unit_text',
        'unit_of_measurement_text',
    ];

    // protected static function newFactory(): UomFactory
    // {
    //     // return UomFactory::new();
    // }
}
