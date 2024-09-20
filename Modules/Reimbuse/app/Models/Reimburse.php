<?php

namespace Modules\Reimbuse\Models;

use App\Traits\UniqueCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

// use Modules\Reimbuse\Database\Factories\ReimburseFactory;

class Reimburse extends Model
{
    use HasFactory, UniqueCode, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        "rn", //request number
        "group", // group for combine reimburse
        "type", // reimburse type or purpose
        "requester", // guy who ask reimburse
        "remark", // reimburse detail (free text)
        "balance",
        "claim_limit",
        "receipt_date",
        "start_date",
        "end_date",
        "start_balance_date",
        "end_balance_date",
        "currency",
    ];

    // protected static function newFactory(): ReimburseFactory
    // {
    //     // return ReimburseFactory::new();
    // }
}
