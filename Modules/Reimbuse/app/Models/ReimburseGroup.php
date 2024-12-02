<?php

namespace Modules\Reimbuse\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Master\Models\MasterCostCenter;
use Modules\Master\Models\MasterStatus;

// use Modules\Reimbuse\Database\Factories\ReimburseGroupFactory;

class ReimburseGroup extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        "code",
        "remark",
        "requester",
        "cost_center",
    ];

    public function reimburses()
    {
        return $this->hasMany(Reimburse::class, 'group', 'code');
    }

    public function costCenter()
    {
        return $this->belongsTo(MasterCostCenter::class, 'cost_center', 'id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'nip', 'requester');
    }

    // protected static function newFactory(): ReimburseGroupFactory
    // {
    //     // return ReimburseGroupFactory::new();
    // }

    public function status()
    {
        return $this->belongsTo(MasterStatus::class, 'status_id', 'id');
    }
}
