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
    protected $fillable = ["code", "group", "name", "claim_limit", "plafon"];

    // protected static function newFactory(): ReimburseTypeFactory
    // {
    //     // return ReimburseTypeFactory::new();
    // }
}
