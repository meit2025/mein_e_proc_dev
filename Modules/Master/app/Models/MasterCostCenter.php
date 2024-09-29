<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterCostCenterFactory;

class MasterCostCenter extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'controlling_area',
        'controlling_name',
        'cost_center',
        'valid_form',
        'valid_to',
        'company_code',
        'company_name',
        'desc',
        'standard_hierarchy_area',
        'short_desc_set',
        'profile_center',
        'long_text',
    ];

    // protected static function newFactory(): MasterCostCenterFactory
    // {
    //     // return MasterCostCenterFactory::new();
    // }
}
