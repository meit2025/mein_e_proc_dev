<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Approval\Models\ApprovalPr;
use Modules\Approval\Models\ApprovalTrackingNumberAuto;
use Modules\Approval\Models\ApprovalTrackingNumberChoose;
use Modules\Approval\Models\ApprovalTrackingNumberChooseRoute;

// use Modules\Master\Database\Factories\MasterTrackingNumberFactory;

class MasterTrackingNumber extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
    ];

    // protected static function newFactory(): MasterTrackingNumberFactory
    // {
    //     // return MasterTrackingNumberFactory::new();
    // }

    public function approvalPr()
    {
        return $this->belongsTo(ApprovalPr::class);
    }
    public function approvalTrackingNumberAuto()
    {
        return $this->belongsTo(ApprovalTrackingNumberAuto::class);
    }
    public function approvalTrackingNumberChoose()
    {
        return $this->belongsTo(ApprovalTrackingNumberChooseRoute::class);
    }
}
