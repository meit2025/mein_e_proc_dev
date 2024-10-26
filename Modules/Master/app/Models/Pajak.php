<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\PajakFactory;

class Pajak extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'desimal',
        'mwszkz',
        'description'
    ];

    // protected static function newFactory(): PajakFactory
    // {
    //     // return PajakFactory::new();
    // }
}
