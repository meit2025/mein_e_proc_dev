<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\ItemCategoryFactory;

class ItemCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'item_category',
        'text_category',
    ];

    // protected static function newFactory(): ItemCategoryFactory
    // {
    //     // return ItemCategoryFactory::new();
    // }
}
