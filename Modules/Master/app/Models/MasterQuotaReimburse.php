<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterQuotaReimburseFactory;

class MasterQuotaReimburse extends Model
{
    use HasFactory;

    protected $fillable = ["period", "type", "user"];
}
