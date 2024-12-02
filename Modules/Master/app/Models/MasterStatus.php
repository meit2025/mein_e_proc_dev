<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterStatusFactory;

class MasterStatus extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['name', 'code', 'className'];




    // protected static function newFactory(): MasterStatusFactory
    // {
    //     // return MasterStatusFactory::new();
    // }
}
