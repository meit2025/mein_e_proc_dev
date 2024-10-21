<?php

namespace Modules\Reimbuse\Models;

use App\Models\User;
use App\Traits\UniqueCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

// use Modules\Reimbuse\Database\Factories\ReimburseFactory;

class Reimburse extends Model
{
    use HasFactory, UniqueCode, SoftDeletes;

    // protected static function boot()
    // {
    //     parent::boot();
    //     static::creating(function ($reimburse) {
    //         $reimburse->rn = self::generateUniqueRn();
    //     });
    // }

    // private static function generateUniqueRn()
    // {
    //     do {
    //         // Generate a random string (e.g., 10 characters long)
    //         $rn = Str::random(10);
    //     } while (self::where('rn', $rn)->exists());

    //     return $rn;
    // }

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        "group",
        "type",
        "remark",
        "for",
        "balance",
        "receipt_date",
        "start_date",
        "end_date",
        "period",
        "currency",
    ];

    // protected static function newFactory(): ReimburseFactory
    // {
    //     // return ReimburseFactory::new();
    // }
}
