<?php

namespace Modules\BusinessTrip\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\BusinessTrip\Database\Factories\AllowanceItemFactory;

class AllowanceItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */

        //   $table->string('type');
        //     $table->float('fixed_value')->nullable();
        //     $table->float('max_value')->nullable();
        //     $table->string('request_value');
        //     $table->text('formula')->nullable();
        //     $table->unsignedBigInteger('currency_id');
        //     $table->unsignedBigInteger('allowance_category_id');
        //     $table->string('code')->unique();
        //     $table->string('name')->unique();
        
    protected $fillable = [
        'type',
        'fixed_value',
        'max_value',
        'request_value',
        'formula',
        'currency_id',
        'allowance_category_id',
        'code',
        'name',
        'grade_option',
        'grade_all_price',
        'material_number',
        'material_group'
    ];

    // protected static function newFactory(): AllowanceItemFactory
    // {
    //     // return AllowanceItemFactory::new();
    // }

    public function allowanceCategory() {
        return $this->belongsTo(AllowanceCategory::class ,'allowance_category_id', 'id');
    }

    public function allowancePurposeType()
    {
        return $this->hasMany(PurposeTypeAllowance::class, 'allowance_items_id', 'id');
    }

    public function allowanceGrades() {
        return $this->hasMany(BusinessTripGradeAllowance::class, 'allowance_item_id', 'id');
    }
}


