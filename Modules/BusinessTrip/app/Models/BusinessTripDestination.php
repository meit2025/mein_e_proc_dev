<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\BusinessTrip\Database\Factories\BusinessTripDestinationFactory;

class BusinessTripDestination extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'destination',
        'business_trip_start_date',
        'business_trip_end_date',
        'business_trip_id'
    ];

    function detailAttendance()
    {
        return $this->hasMany(BusinessTripDetailAttedance::class, 'business_trip_destination_id', 'id');
    }

    function detailDestinationDay()
    {
        return $this->hasMany(BusinessTripDetailDestinationDayTotal::class, 'business_trip_destination_id', 'id');
    }

    function detailDestinationTotal()
    {
        return $this->hasMany(BusinessTripDetailDestinationTotal::class, 'business_trip_destination_id', 'id');
    }

    public function combinedDetailDestinations()
    {
        // Pastikan kedua relasi selalu mengembalikan koleksi meskipun kosong
        $dayDetails = $this->detailDestinationDay ?? collect();
        $totalDetails = $this->detailDestinationTotal ?? collect();

        return $dayDetails->merge($totalDetails);
    }

    //   $table->string('destination');
    //         $table->date('business_trip_start_date');
    //         $table->date('business_trip_end_date');
    //         $table->unsignedBigInteger('business_trip_id');

    // protected static function newFactory(): BusinessTripDestinationFactory
    // {
    //     // return BusinessTripDestinationFactory::new();
    // }
}
