<?php

namespace Modules\Approval\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Approval\Database\Factories\ApprovalTrackingNumberChooseFactory;

class ApprovalTrackingNumberChoose extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
    ];

    // protected static function newFactory(): ApprovalTrackingNumberChooseFactory
    // {
    //     // return ApprovalTrackingNumberChooseFactory::new();
    // }
    public function approvalTrackingNumberRoute()
    {
        return $this->hasMany(ApprovalTrackingNumberChooseRoute::class);
    }
    public function approvalRoute()
    {
        return $this->hasMany(ApprovalTrackingNumberChooseRoute::class);
    }
}
