<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

// use Modules\BusinessTrip\Database\Factories\DestinationFactory;

class Destination extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'destinations';
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [

        'code',
        'destination',
        'type',
        'region'
    ];

    // protected static function newFactory(): DestinationFactory
    // {
    //     // return DestinationFactory::new();
    // }
}
