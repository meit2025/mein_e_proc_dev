<?php

namespace Modules\Reimbuse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

// use Modules\Reimbuse\Database\Factories\ReimburseUsedFactory;

class ReimburseUsed extends Model
{
    protected $table = "reimburse_used";

    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['reimburse', 'user'];

    // protected static function newFactory(): ReimburseUsedFactory
    // {
    //     // return ReimburseUsedFactory::new();
    // }
}
