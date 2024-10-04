<?php

namespace Modules\Reimbuse\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Reimbuse\Database\Factories\ReimburseGroupFactory;

class ReimburseGroup extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        "code",
        "remark",
        "requester"
    ];
    
    public function reimburses()
    {
        return $this->hasMany(Reimburse::class, 'group', 'code');
    }

    public function users()
    {
        return $this->hasOne(User::class, 'nip', 'requester');
    }

    // protected static function newFactory(): ReimburseGroupFactory
    // {
    //     // return ReimburseGroupFactory::new();
    // }
}
