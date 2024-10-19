<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\BusinessTrip\Database\Factories\BusinessTripAttachmentFactory;

class BusinessTripAttachment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $guarded = [];
    protected $table  = 'business_trip_attachment';

    // protected static function newFactory(): BusinessTripAttachmentFactory
    // {
    //     // return BusinessTripAttachmentFactory::new();
    // }
}
