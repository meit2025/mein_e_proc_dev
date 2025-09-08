<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

// use Modules\BusinessTrip\Database\Factories\PurposeTypeFactory;

class PurposeType extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */


    protected $fillable = [
        'code',
        'name',
        'attedance_status'
    ];


    public function listAllowance()
    {
        return $this->hasMany(PurposeTypeAllowance::class, 'purpose_type_id', 'id')->withTrashed();
    }

    protected static function newFactory(): PurposeTypeFactory
    {
        // return PurposeTypeFactory::new();
    }
}
