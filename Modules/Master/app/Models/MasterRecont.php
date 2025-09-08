<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterRecontFactory;

class MasterRecont extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'account',
        'account_long_text',
        'desc',
        'recon_acc',
    ];

    // protected static function newFactory(): MasterRecontFactory
    // {
    //     // return MasterRecontFactory::new();
    // }
}
