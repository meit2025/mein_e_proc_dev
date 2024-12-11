<?php

namespace Modules\Approval\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Master\Models\DocumentType;
use Modules\Master\Models\MasterDivision;
use Modules\Master\Models\MasterTrackingNumber;
use Modules\Master\Models\PurchasingGroup;

// use Modules\Approval\Database\Factories\ApprovalPrFactory;

class ApprovalPr extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'document_type_id',
        'dscription',
        'is_condition',
        'condition_type',
        'min_value',
        'max_value',
        'value',
        'master_division_id',
        'purchasing_group_id',
        'master_tracking_number_id',
    ];

    // protected static function newFactory(): ApprovalPrFactory
    // {
    //     // return ApprovalPrFactory::new();
    // }

    public function approvalRoute()
    {
        return $this->hasMany(ApprovalPrRoute::class);
    }
    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function masterDivision()
    {
        return $this->belongsTo(MasterDivision::class);
    }

    public function purchasingGroup()
    {
        return $this->belongsTo(PurchasingGroup::class);
    }
    public function masterTrackingNumber()
    {
        return $this->belongsTo(MasterTrackingNumber::class);
    }
}
