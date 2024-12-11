<?php

namespace Modules\Master\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterDepartmentFactory;

class MasterDepartment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name'
    ];

    public function users()
    {
        return $this->hasOne(User::class, 'departement_id');
    }

    // protected static function newFactory(): MasterDepartmentFactory
    // {
    //     // return MasterDepartmentFactory::new();
    // }
}
