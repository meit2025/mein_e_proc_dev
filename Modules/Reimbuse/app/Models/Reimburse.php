<?php

namespace Modules\Reimbuse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Modules\Master\Models\MasterPeriodReimburse;
use Modules\Master\Models\MasterStatus;
use Modules\Master\Models\MasterTypeReimburse;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\PurchasingGroup;
use Modules\Master\Models\Uom;

// use Modules\Reimbuse\Database\Factories\ReimburseFactory;

class Reimburse extends Model
{
    use HasFactory, SoftDeletes;

    // protected static function boot()
    // {
    //     parent::boot();
    //     static::creating(function ($reimburse) {
    //         $reimburse->rn = self::generateUniqueRn();
    //     });
    // }

    // private static function generateUniqueRn()
    // {
    //     do {
    //         // Generate a random string (e.g., 10 characters long)
    //         $rn = Str::random(10);
    //     } while (self::where('rn', $rn)->exists());

    //     return $rn;
    // }

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        "group",
        "reimburse_type",
        "type",
        "currency",
        "short_text",
        "for",
        "balance",
        "item_delivery_data",
        "start_date",
        "end_date",
        "period",
        "pembeda",
        "tracking_number",
        "item_number",
        "purchase_requisition_document_type",
        "valuation_type",
        "purchase_requisition_closed",
        'purchasing_group',
        'purchasing_organization',
        'requester',
        'account_assignment',
        'storage_location',
        'desired_vendor',
        'purchase_requisition_unit_of_measure',
        'purchase_requisition_quantity',
        'tax_on_sales',
        'item_category_in_purchasing_document',
        'plant',
        'uom',
    ];


    public function uomModel()
    {
        return $this->belongsTo(Uom::class, 'uom', 'id');
    }

    /*************  ✨ Codeium Command ⭐  *************/
    /******  ed3796dc-0f38-43e8-9594-0a544290ec32  *******/    public function purchasingGroupModel()
    {
        return $this->belongsTo(PurchasingGroup::class, 'purchasing_group', 'id');
    }

    public function taxOnSalesModel()
    {
        return $this->belongsTo(Pajak::class, 'tax_on_sales', 'id');
    }


    public function reimburseType()
    {
        return $this->belongsTo(MasterTypeReimburse::class, 'reimburse_type', 'code');
    }

    public function periodeDate()
    {
        return $this->belongsTo(MasterPeriodReimburse::class, 'period', 'code');
    }

    public function status()
    {
        return $this->belongsTo(MasterStatus::class, 'status_id', 'id');
    }
}
