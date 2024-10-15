<?php

namespace Modules\Approval\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Approval\Database\Factories\SettingApprovalFactory;

class SettingApproval extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'titel',
        'key',
        'is_active',
        'value',
    ];

    // protected static function newFactory(): SettingApprovalFactory
    // {
    //     // return SettingApprovalFactory::new();
    // }
}
