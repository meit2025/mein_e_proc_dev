<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\BusinessTrip\Database\Factories\AllowanceCategoryFactory;

class AllowanceCategory extends Model
{
    use HasFactory;


    protected $table = 'allowance_categories';


    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'code'
    ];

    // protected static function newFactory(): AllowanceCategoryFactory
    // {
    //     // return AllowanceCategoryFactory::new();
    // }
}
