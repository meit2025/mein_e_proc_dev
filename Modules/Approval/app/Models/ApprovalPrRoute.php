<?php

namespace Modules\Approval\Models;

use App\Models\User;
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
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // protected static function newFactory(): ApprovalPrRouteFactory
    // {
    //     // return ApprovalPrRouteFactory::new();
    // }
}
