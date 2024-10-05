<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\AccountAssignmentCategoryFactory;

class AccountAssignmentCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    // protected static function newFactory(): AccountAssignmentCategoryFactory
    // {
    //     // return AccountAssignmentCategoryFactory::new();
    // }
}
