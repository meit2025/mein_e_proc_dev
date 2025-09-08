<?php

namespace Modules\Approval\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Approval\Database\Factories\ApprovalRouteUsersFactory;

class ApprovalRouteUsers extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'approval_route_id',
        'is_bt',
        'is_reim',
    ];

    public function approvalRoute()
    {
        return $this->belongsTo(ApprovalRoute::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
