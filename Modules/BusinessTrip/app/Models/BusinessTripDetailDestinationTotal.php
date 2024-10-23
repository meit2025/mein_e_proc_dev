<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\BusinessTrip\Database\Factories\BusinessTripDetailDestinationTotalFactory;

class BusinessTripDetailDestinationTotal extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $guarded = [];

    // protected static function newFactory(): BusinessTripDetailDestinationTotalFactory
    // {
    //     // return BusinessTripDetailDestinationTotalFactory::new();
    // }

    function allowance()
    {
        return $this->hasMany(allowanceItem::class, 'allowance_item_id', 'id');
    }
}
