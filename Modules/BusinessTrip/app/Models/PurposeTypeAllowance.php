<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\BusinessTrip\Database\Factories\PurposeTypeAllowanceFactory;

class PurposeTypeAllowance extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'allowance_items_id',
        'purpose_type_id'
    ];


    public function allowanceItem() {
        return $this->belongsTo(allowanceItem::class , 'allowance_items_id', 'id');
    }

    public function purposeType()
    {
        return $this->belongsTo(PurposeType::class, 'purpose_type_id', 'id');
    }

    // protected static function newFactory(): PurposeTypeAllowanceFactory
    // {
    //     // return PurposeTypeAllowanceFactory::new();
    // }
}
