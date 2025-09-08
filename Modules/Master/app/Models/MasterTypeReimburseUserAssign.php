<?php

namespace Modules\Master\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\BusinessTrip\Models\BusinessTripGradeUser;
use Modules\Master\Models\MasterTypeReimburse;

class MasterTypeReimburseUserAssign extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $table ='master_type_reimburse_user_assign';
    protected $fillable = [
        'user_id',
        'reimburse_type_id',
        'is_assign'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function families() {
        return $this->hasMany(Family::class, 'userId', 'user_id');
    }

    public function reimburseTypeUserAssign()
    {
        return $this->belongsTo(MasterTypeReimburse::class, 'reimburse_type_id', 'id');
    }

    public function masterTypeReimburse()
    {
        return $this->belongsTo(MasterTypeReimburse::class, 'reimburse_type_id', 'id');
    }
}
