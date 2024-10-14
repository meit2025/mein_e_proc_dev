<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\BusinessTrip\Database\Factories\BusinessTripGradeFactory;

class BusinessTripGrade extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'grade'
    ];

    // protected static function newFactory(): BusinessTripGradeFactory
    // {
    //     // return BusinessTripGradeFactory::new();
    // }

    public function gradeUsers(){
        return $this->hasMany(BusinessTripGradeUser::class, 'grade_id', 'id');
    }
}
