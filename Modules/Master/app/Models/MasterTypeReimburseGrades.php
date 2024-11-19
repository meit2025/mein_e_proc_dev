<?php

namespace Modules\Master\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\BusinessTrip\Models\BusinessTripGrade;

class MasterTypeReimburseGrades extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'grade_id',
        'reimburse_type_id',
        'plafon'
    ];

    public function grade() {
        return $this->belongsTo(BusinessTripGrade::class ,'grade_id', 'id');
    }

    public function reimburseType()
    {
        return $this->belongsTo(MasterQuotaReimburse::class, 'reimburse_type_id', 'id');
    }
}
