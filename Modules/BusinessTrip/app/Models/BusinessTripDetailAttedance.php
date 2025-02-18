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
        'start_date',
        'end_date',
        'date',
    ];

    function getStartTimeAttribute()
    {
        return date('H:i', strtotime($this->attributes['start_time']));
    }
    function getEndTimeAttribute()
    {
        return date('H:i', strtotime($this->attributes['end_time']));
    }

    function getShiftStartAttribute()
    {
        return date('H:i', strtotime($this->attributes['shift_start']));
    }
    function getShiftEndAttribute()
    {
        return date('H:i', strtotime($this->attributes['shift_end']));
    }

    // protected static function newFactory(): BusinessTripDetailAttedanceFactory
    // {
    //     // return BusinessTripDetailAttedanceFactory::new();
    // }
}
