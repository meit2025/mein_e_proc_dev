<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Reimbuse\Models\Reimburse;

class MasterTypeReimburse extends Model
{
    use HasFactory;

    protected $fillable = ["code", "name", "is_employee", "limit", "material_group", "material_number", "grade_option", "grade_all_price", "family_status", "interval_claim_period"];

    public function reimburseTypeGrades()
    {
        return $this->hasMany(MasterTypeReimburseGrades::class, 'reimburse_type_id', 'id');
    }

    public function gradeReimburseTypes()
    {
        return $this->hasOne(MasterTypeReimburseGrades::class, 'reimburse_type_id', 'id');
    }

    public function getGradePriceAttribute()
    {
        // Cek nilai grade_option
        if ($this->grade_option === 'all') {
            return $this->grade_all_price;
        } elseif ($this->grade_option === 'grade') {
            // Ambil dari relasi gradeAllowances
            return $this->gradeAllowance->plafon; // Contoh: jumlah total allowance
        }

        return null; // Jika tidak ada yang cocok
    }

    public function reimburseTypeUserAssign()
    {
        return $this->hasMany(MasterTypeReimburseUserAssign::class, 'reimburse_type_id', 'id');
    }

    public function reimburseTypeOneUserAssign()
    {
        return $this->hasOne(MasterTypeReimburseUserAssign::class, 'reimburse_type_id', 'id');
    }

    public function masterMaterial()
    {
        return $this->belongsTo(MasterMaterial::class, 'material_number', 'id');
    }

    public function materialGroup()
    {
        return $this->belongsTo(MaterialGroup::class, 'material_group', 'id');
    }

    public function reimburses()
    {
        return $this->hasMany(Reimburse::class, 'reimburse_type', 'code');
    }
}
