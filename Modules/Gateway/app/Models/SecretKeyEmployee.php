<?php

namespace Modules\Gateway\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Gateway\Database\Factories\SecretKeyEmployeeFactory;

class SecretKeyEmployee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'key',
        'secret_key',
        'employee',
        'desc',
        'is_status',
    ];

    // protected static function newFactory(): SecretKeyEmployeeFactory
    // {
    //     // return SecretKeyEmployeeFactory::new();
    // }
}
