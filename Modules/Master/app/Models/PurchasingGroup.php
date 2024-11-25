<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Approval\Models\ApprovalPr;
use Modules\Approval\Models\ApprovalTrackingNumberAuto;

// use Modules\Master\Database\Factories\PurchasingGroupFactory;

class PurchasingGroup extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'purchasing_group',
        'purchasing_group_desc',

    ];

    // protected static function newFactory(): PurchasingGroupFactory
    // {
    //     // return PurchasingGroupFactory::new();
    // }
    public function approvalPr()
    {
        return $this->belongsTo(ApprovalPr::class);
    }

    public function approvalTrackingNumber()
    {
        return $this->belongsTo(ApprovalTrackingNumberAuto::class);
    }
}
