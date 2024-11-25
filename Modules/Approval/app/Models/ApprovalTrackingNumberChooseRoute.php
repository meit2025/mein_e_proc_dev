<?php

namespace Modules\Approval\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Master\Models\MasterTrackingNumber;

// use Modules\Approval\Database\Factories\ApprovalTrackingNumberChooseRouteFactory;

class ApprovalTrackingNumberChooseRoute extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'master_tracking_number_id',
        'approval_tracking_number_choose_id'
    ];

    // protected static function newFactory(): ApprovalTrackingNumberChooseRouteFactory
    // {
    //     // return ApprovalTrackingNumberChooseRouteFactory::new();
    // }
    public function approvalTrackingNumber()
    {
        return $this->hasMany(ApprovalTrackingNumberChoose::class);
    }

    public function masterTrackingNumber()
    {
        return $this->belongsTo(MasterTrackingNumber::class);
    }
}
