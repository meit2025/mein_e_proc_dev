<?php

namespace Modules\Gateway\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Gateway\Database\Factories\LogFactory;

class Log extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'releted_id',
        'function_name',
        'level',
        'message',
        'context',
    ];

    // protected static function newFactory(): LogFactory
    // {
    //     // return LogFactory::new();
    // }
}
