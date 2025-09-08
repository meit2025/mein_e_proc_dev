<?php

namespace Modules\Approval\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Approval\Database\Factories\ApprovalConditionalUsersRouteFactory;

class ApprovalConditionalUsersRoute extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'approval_conditional_users_id',
        'user_id',
    ];

    // protected static function newFactory(): ApprovalConditionalUsersRouteFactory
    // {
    //     // return ApprovalConditionalUsersRouteFactory::new();
    // }

    public function approvalConditionalUser()
    {
        return $this->belongsTo(ApprovalConditionalUsers::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
