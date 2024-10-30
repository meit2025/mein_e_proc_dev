<?php

namespace Modules\Master\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Family extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'user', 'status', 'bod'];

    public function user()
    {
        return $this->hasOne(User::class, 'nip', 'user');
    }
}
