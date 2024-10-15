<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\BusinessTrip\Database\Factories\BusinessTripDetailAttedanceFactory;

class BusinessTripDetailAttedance extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'business_trip_id',
        'business_trip_destination_id',
        'shift_code',
        'shift_end',
        'shift_start',
        'start_time',
        'end_time',
        'date',
    ];

    

    // protected static function newFactory(): BusinessTripDetailAttedanceFactory
    // {
    //     // return BusinessTripDetailAttedanceFactory::new();
    // }
}
