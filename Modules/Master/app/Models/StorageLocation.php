<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StorageLocation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'plant',
        'storage_location',
        'storage_location_desc',
    ];

    // protected static function newFactory(): StorageLocationFactory
    // {
    //     // return StorageLocationFactory::new();
    // }
}
