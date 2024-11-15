<?php

namespace Modules\Master\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Master\Models\MasterQuotaReimburse;

class MasterQuotaReimburseUser extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'quota_reimburses_id'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function quotaReimburses()
    {
        return $this->belongsTo(MasterQuotaReimburse::class, 'quota_reimburses_id', 'id');
    }
}
