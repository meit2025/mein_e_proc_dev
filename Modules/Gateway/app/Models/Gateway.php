<?php

namespace Modules\Gateway\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

// use Modules\Gateway\Database\Factories\GatewayFactory;

class Gateway extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'tabel_name',
        'methods',
        'authentication',
        'desc',
        'command',
    ];

    public function gatewayValues()
    {
        return $this->hasMany(GatewayValue::class, 'gateways_id');
    }
}
