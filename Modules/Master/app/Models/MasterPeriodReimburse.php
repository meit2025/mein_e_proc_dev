<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Master\Database\Factories\MasterPeriodReimburseFactory;

class MasterPeriodReimburse extends Model
{
    use HasFactory;

    protected $fillable = ["code", "start", "end"];
}
