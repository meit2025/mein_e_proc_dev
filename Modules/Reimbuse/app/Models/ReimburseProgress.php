<?php

namespace Modules\Reimbuse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

// use Modules\Reimbuse\Database\Factories\ReimburseProgressFactory;

class ReimburseProgress extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ["group", "approver", "notes", "status"];

    // protected static function newFactory(): ReimburseProgressFactory
    // {
    //     // return ReimburseProgressFactory::new();
    // }
}
