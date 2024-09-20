<?php

namespace Modules\Reimbuse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Reimbuse\Database\Factories\ReimburseTypeFactory;

class ReimburseType extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ["name"];

    // protected static function newFactory(): ReimburseTypeFactory
    // {
    //     // return ReimburseTypeFactory::new();
    // }
}
