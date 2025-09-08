<?php

namespace Modules\Master\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Reimbuse\Models\Reimburse;

class Family extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'userId', 'status', 'bod'];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId', 'id');
    }

    public function reimburses() {
        return $this->hasMany(Reimburse::class, 'for', 'id');
    }
}
