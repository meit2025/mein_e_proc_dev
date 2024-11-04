<?php

namespace Modules\BusinessTrip\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Master\Models\MasterCostCenter;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\PurchasingGroup;

// use Modules\BusinessTrip\Database\Factories\BusinessTripFactory;

class BusinessTrip extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */

    protected $table = 'business_trip';
    protected $fillable = [
        'purpose_type_id',
        'request_no',
        'request_for',
        'created_by',
        'remarks',
        'total_destination',
        'cash_advance',
        'total_cash_advance',
        'total_percent',
        'type',
        'parent_id',
        'cost_center_id',
        'pajak_id',
        'purchasing_group_id',
    ];


    // protected static function newFactory(): BusinessTripFactory
    // {
    //     // return BusinessTripFactory::new();
    // }

    public function businessTripDestination()
    {
        return $this->hasMany(BusinessTripDestination::class, 'business_trip_id', 'id');
    }

    function purposeType()
    {
        return $this->belongsTo(PurposeType::class);
    }

    function attachment()
    {
        return $this->hasMany(BusinessTripAttachment::class, 'business_trip_id', 'id');
    }

    function detailAttendance()
    {
        return $this->hasMany(BusinessTripDetailAttedance::class, 'business_trip_id', 'id');
    }

    function requestFor()
    {
        return $this->belongsTo(User::class, 'request_for', 'id');
    }
    function requestedBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    function costCenter()
    {
        return $this->belongsTo(MasterCostCenter::class, 'cost_center_id', 'id');
    }

    function pajak()
    {
        return $this->belongsTo(Pajak::class, 'pajak_id', 'id');
    }

    function purchasingGroup()
    {
        return $this->belongsTo(PurchasingGroup::class, 'purchasing_group_id', 'id');
    }
}
