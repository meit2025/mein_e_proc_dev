<?php

namespace Modules\Master\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Approval\Models\ApprovalPr;

// use Modules\Master\Database\Factories\MasterPostionFactory;

class MasterPosition extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
    ];

    public function users()
    {
        return $this->hasOne(User::class, 'position_id', 'id');
    }

    public function approvalPr()
    {
        return $this->belongsTo(ApprovalPr::class);
    }

    // protected static function newFactory(): MasterPostionFactory
    // {
    //     // return MasterPostionFactory::new();
    // }
}
