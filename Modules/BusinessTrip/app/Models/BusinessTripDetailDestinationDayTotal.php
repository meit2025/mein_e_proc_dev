<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\BusinessTrip\Database\Factories\BusinessTripDetailDestinationDayTotalFactory;

class BusinessTripDetailDestinationDayTotal extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $guarded = [];
    // protected $fillable = [
    //     'date',
    //     'business_trip_destination_id',
    //     'business_trip_id',
    //     'price'
    // ];
    //  $table->date('date');
    //         $table->unsignedBigInteger('business_trip_destination_id');
    //         $table->unsignedBigInteger('business_trip_id');
    //         $table->float('price')->default(0);

    // protected static function newFactory(): BusinessTripDetailDestinationDayTotalFactory
    // {
    //     // return BusinessTripDetailDestinationDayTotalFactory::new();
    // }

    function allowance()
    {
        return $this->belongsTo(AllowanceItem::class, 'allowance_item_id', 'id')->withTrashed();
    }
}
