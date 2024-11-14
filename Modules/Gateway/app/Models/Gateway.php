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
        'code_endpoint',
        'name',
        'tabel_name',
        'methods',
        'desc',
        'command',
        'is_status',
        'type'
    ];

    public function gatewayValues()
    {
        return $this->hasMany(GatewayValue::class, 'gateways_id');
    }
}
