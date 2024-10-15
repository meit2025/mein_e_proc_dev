<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\PurchaseRequisition\Database\Factories\ItemFactory;

class Item extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'procurement_id',
        'material_number',
        'qty',
    ];

    public function procurement()
    {
        return $this->belongsTo(Procurement::class);
    }
}
