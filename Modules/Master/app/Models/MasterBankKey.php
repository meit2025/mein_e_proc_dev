<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterBankKeyFactory;

class MasterBankKey extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'region_key',
        'bank_keys',
        'name_financial_institution',
        'city',
        'street_house_number',
        'bank_branch',
    ];

    // protected static function newFactory(): MasterBankKeyFactory
    // {
    //     // return MasterBankKeyFactory::new();
    // }
}
