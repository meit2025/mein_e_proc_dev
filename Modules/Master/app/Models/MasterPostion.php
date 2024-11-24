<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterPostionFactory;

class MasterPostion extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    // protected static function newFactory(): MasterPostionFactory
    // {
    //     // return MasterPostionFactory::new();
    // }
}
