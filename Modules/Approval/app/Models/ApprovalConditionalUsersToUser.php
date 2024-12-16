<?php

namespace Modules\Approval\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Approval\Database\Factories\ApprovalConditionalUsersToUserFactory;

class ApprovalConditionalUsersToUser extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'approval_conditional_users_id',
        'user_id',
    ];

    // protected static function newFactory(): ApprovalConditionalUsersToUserFactory
    // {
    //     // return ApprovalConditionalUsersToUserFactory::new();
    // }
}
