<?php

namespace Modules\Reimbuse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Reimbuse\Database\Factories\ReimburseTypeFactory;

class ReimburseType extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $primaryKey = 'code';
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ["code", "name", "is_employee"];

    public function quotas()
    {
        return $this->hasMany(ReimburseQuota::class, 'type', 'code');
    }

    // protected static function newFactory(): ReimburseTypeFactory
    // {
    //     // return ReimburseTypeFactory::new();
    // }
}
