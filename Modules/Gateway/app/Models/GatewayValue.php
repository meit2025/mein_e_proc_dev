<?php

namespace Modules\Gateway\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

// use Modules\Gateway\Database\Factories\GatewayValueFactory;

class GatewayValue extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'gateways_id',
        'column_value',
        'value',
    ];

    public function gateway()
    {
        return $this->belongsTo(Gateway::class, 'gateways_id');
    }
}
