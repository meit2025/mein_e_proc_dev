<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\BusinessTrip\Database\Factories\PurposeTypeAllowanceFactory;

class PurposeTypeAllowance extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    // protected static function newFactory(): PurposeTypeAllowanceFactory
    // {
    //     // return PurposeTypeAllowanceFactory::new();
    // }
}
