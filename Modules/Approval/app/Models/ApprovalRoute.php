<?php

namespace Modules\Approval\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Approval\Database\Factories\ApprovalRouteFactory;

class ApprovalRoute extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'group_id',
        'is_hr',
        'hr_approval',
        'user_hr_id',
        'is_conditional',
        'nominal',
        'is_bt',
        'is_reim',
        'day',
        'is_restricted_area',
    ];

    public function userApprovals()
    {
        return $this->hasMany(ApprovalRouteUsers::class);
    }

    // protected static function newFactory(): ApprovalRouteFactory
    // {
    //     // return ApprovalRouteFactory::new();
    // }
}
