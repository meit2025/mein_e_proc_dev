<?php

namespace Modules\Master\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\BusinessTrip\Models\BusinessTripGrade;
use Modules\Master\Models\MasterQuotaReimburseUser;

// use Modules\Master\Database\Factories\MasterQuotaReimburseFactory;

class MasterQuotaReimburse extends Model
{
    use HasFactory;

    protected $fillable = ["period", "type", "user"];

    public function user()
    {
        return $this->belongsTo(User::class, 'user', 'id');
    }

    public function type()
    {
        return $this->belongsTo(MasterTypeReimburse::class, 'type', 'id');
    }

    public function period()
    {
        return $this->belongsTo(MasterPeriodReimburse::class, 'period', 'id');
    }

    public function quotaReimburseUsers()
    {
        return $this->hasMany(MasterQuotaReimburseUser::class, 'quota_reimburses_id', 'id');
    }
}
