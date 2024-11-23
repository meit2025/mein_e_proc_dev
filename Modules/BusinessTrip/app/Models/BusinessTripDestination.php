<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;

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
        'business_trip_id',
        'other_allowance',
        'pajak_id',
        'purchasing_group_id',
        'cash_advance',
        'total_percent',
        'total_cash_advance',
        'reference_number',
    ];

    function detailAttendance()
    {
        return $this->hasMany(BusinessTripDetailAttedance::class, 'business_trip_destination_id', 'id');
    }

    function getDetailDestinationDay()
    {
        return $this->hasMany(BusinessTripDetailDestinationDayTotal::class, 'business_trip_destination_id', 'id');
    }

    function detailDestinationDay()
    {
        return $this->hasMany(BusinessTripDetailDestinationDayTotal::class, 'business_trip_destination_id', 'id')
            ->select('business_trip_destination_id', 'allowance_item_id', DB::raw('SUM(price) as price'), DB::raw('count(*) as total'), 'standard_value','percentage')
            ->groupBy('business_trip_destination_id', 'allowance_item_id', 'standard_value', 'percentage');
    }

    function detailDestinationTotal()
    {
        return $this->hasMany(BusinessTripDetailDestinationTotal::class, 'business_trip_destination_id', 'id');
    }

    function groupDestination()
    {
        return $this->detailDestinationDay->groupBy('allowance_item_id');
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
