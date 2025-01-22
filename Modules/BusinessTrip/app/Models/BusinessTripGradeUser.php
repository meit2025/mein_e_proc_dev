<?php

namespace Modules\BusinessTrip\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Master\Models\MasterTypeReimburseUserAssign;

class BusinessTripGradeUser extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'grade_id'
    ];

    // protected static function newFactory(): BusinessTripGradeUserFactory
    // {
    //     // return BusinessTripGradeUserFactory::new();
    // }

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function grade()
    {
        return $this->belongsTo(BusinessTripGrade::class, 'grade_id', 'id');
    }

    public function reimburseTypeAssignUsers()
    {
        return $this->belongsTo(MasterTypeReimburseUserAssign::class, 'user_id', 'user_id');
    }
}