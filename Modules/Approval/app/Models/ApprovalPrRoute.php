<?php

namespace Modules\Approval\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Approval\Database\Factories\ApprovalPrRouteFactory;

class ApprovalPrRoute extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'approval_pr_id',
    ];

    public function approvalPr()
    {
        return $this->hasMany(ApprovalPr::class);
    }

    // protected static function newFactory(): ApprovalPrRouteFactory
    // {
    //     // return ApprovalPrRouteFactory::new();
    // }
}
