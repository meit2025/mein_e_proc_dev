<?php

namespace Modules\BusinessTrip\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Master\Models\MasterCostCenter;
use Modules\Master\Models\MasterStatus;
use Modules\Master\Models\Pajak;
use Modules\Master\Models\PurchasingGroup;

// use Modules\BusinessTrip\Database\Factories\BusinessTripFactory;

class BusinessTrip extends Model
{
    use HasFactory, SoftDeletes;

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
        'type',
        'parent_id',
        'cost_center_id',
        'uom_id',
        'status_id'
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

    function parentBusinessTrip()
    {
        return $this->belongsTo(BusinessTrip::class, 'parent_id', 'id');
    }

    function status()
    {
        return $this->belongsTo(MasterStatus::class, 'status_id', 'id');
    }

    function scopeSearch($query, array $filters) {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query
            ->where('request_no', 'ILIKE', '%' . $search . '%')
            ->orWhere('remarks', 'ILIKE', '%' . $search . '%')
            ->orWhere('created_at', 'ILIKE', '%' . $search . '%')
            ->orWhereHas('status', function ($query) use ($search) {
                $query->where('name', 'ILIKE', '%' . $search . '%');
            })
            ->orWhereHas('purposeType', function ($query) use ($search) {
                $query->where('name', 'ILIKE', '%' . $search . '%');
            });
        });
    }
}
