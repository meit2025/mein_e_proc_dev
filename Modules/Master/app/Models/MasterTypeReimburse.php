<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterTypeReimburse extends Model
{
    use HasFactory;

    protected $fillable = ["code", "name", "is_employee", "limit", "plafon", "material_group", "material_number", "grade"];

    public function quotas()
    {
        return $this->hasMany(MasterQuotaReimburse::class, 'type', 'code');
    }
}
