<?php

namespace Modules\Reimbuse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Reimbuse\Database\Factories\ReimburseGroupFactory;

class ReimburseGroup extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    // protected static function newFactory(): ReimburseGroupFactory
    // {
    //     // return ReimburseGroupFactory::new();
    // }
}
