<?php

namespace Modules\Approval\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Approval\Database\Factories\ApprovalConditionalUsersFactory;

class ApprovalConditionalUsers extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'description',
    ];

    // protected static function newFactory(): ApprovalConditionalUsersFactory
    // {
    //     // return ApprovalConditionalUsersFactory::new();
    // }

    public function routes()
    {
        return $this->hasMany(ApprovalConditionalUsersRoute::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'approval_conditional_users_to_users', 'approval_conditional_users_id', 'user_id');
    }
}
