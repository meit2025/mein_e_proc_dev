<?php

namespace Modules\Reimbuse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Reimbuse\Database\Factories\ReimbursePeriodFactory;

class ReimbursePeriod extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    // protected static function newFactory(): ReimbursePeriodFactory
    // {
    //     // return ReimbursePeriodFactory::new();
    // }
}
