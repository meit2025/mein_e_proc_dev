<?php

namespace Modules\Approval\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Approval\Database\Factories\ApprovalToUserFactory;

class ApprovalToUser extends Model
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

    // protected static function newFactory(): ApprovalToUserFactory
    // {
    //     // return ApprovalToUserFactory::new();
    // }
}
