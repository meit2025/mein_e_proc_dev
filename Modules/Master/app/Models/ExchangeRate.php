<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExchangeRate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'worklist',
        'er',
        'from',
        'to',
        'relation',
        'last_date',
        'old_er',
        'tolerance'
    ];
}
