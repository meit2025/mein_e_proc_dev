<?php

namespace Modules\Approval\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Master\Models\MasterTrackingNumber;
use Modules\Master\Models\PurchasingGroup;

// use Modules\Approval\Database\Factories\ApprovalTrackingNumberAutoFactory;

class ApprovalTrackingNumberAuto extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'purchasing_group_id',
        'master_tracking_number_id',
    ];

    // protected static function newFactory(): ApprovalTrackingNumberAutoFactory
    // {
    //     // return ApprovalTrackingNumberAutoFactory::new();
    // }

    public function purchasingGroup()
    {
        return $this->belongsTo(PurchasingGroup::class);
    }
    public function masterTrackingNumber()
    {
        return $this->belongsTo(MasterTrackingNumber::class);
    }
}
