<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterOrderFactory;

class MasterOrder extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'order_number',
        'desc',
        'order_type',
        'short_text',
        'company_code',
        'company_name',
        'profile_center',
        'long_text',
    ];

    // protected static function newFactory(): MasterOrderFactory
    // {
    //     // return MasterOrderFactory::new();
    // }
}
