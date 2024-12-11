<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\DataDropdownFactory;

class DataDropdown extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'doc_id',
        'dropdown_type',
        'tabel_name',
        'field_name',
        'data_dropdown',
    ];

    // protected static function newFactory(): DataDropdownFactory
    // {
    //     // return DataDropdownFactory::new();
    // }
}
