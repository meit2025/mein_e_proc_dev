<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\BusinessTrip\Database\Factories\BusinessTripFactory;

class BusinessTrip extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */

    protected $table = 'business_trip';
    protected $fillable = [
        'purpose_type_id',
        'request_no',
        'request_for',
        'created_by',
        'remarks',
        'total_destination',
    ];


    // protected static function newFactory(): BusinessTripFactory
    // {
    //     // return BusinessTripFactory::new();
    // }

    public function businessTripDestination() {
        return $this->hasMany(BusinessTripDestination::class, 'business_trip_id', 'id');
    }

    function purposeType() {
        return $this->belongsTo(PurposeType::class);
    }

    function attachment() {
        return $this->hasMany(BusinessTripAttachment::class, 'business_trip_id', 'id');
    }

    function detailAttendance() {
        return $this->hasMany(BusinessTripDetailAttedance::class, 'business_trip_id', 'id');
    }
}
