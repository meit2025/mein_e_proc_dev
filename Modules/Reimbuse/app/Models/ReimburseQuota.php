<?php

namespace Modules\Reimbuse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

// use Modules\Reimbuse\Database\Factories\ReimburseQuotaFactory;

class ReimburseQuota extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ["user", "period", "type", "value", "plafon"];

    public function used()
    {
        return $this->hasMany(ReimburseUsed::class, 'quota', 'id');
    }

    // protected static function newFactory(): ReimburseQuotaFactory
    // {
    //     // return ReimburseQuotaFactory::new();
    // }
}
