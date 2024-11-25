<?php

namespace Modules\Master\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Approval\Models\ApprovalPr;

// use Modules\Master\Database\Factories\MasterDivisionFactory;

class MasterDivision extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name'
    ];

    public function users()
    {
        return $this->hasOne(User::class, 'division_id', 'id');
    }

    // protected static function newFactory(): MasterDivisionFactory
    // {
    //     // return MasterDivisionFactory::new();
    // }

    public function approvalPr()
    {
        return $this->belongsTo(ApprovalPr::class);
    }
}
