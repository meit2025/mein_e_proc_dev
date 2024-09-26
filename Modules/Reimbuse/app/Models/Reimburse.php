<?php

namespace Modules\Reimbuse\Models;

use App\Models\User;
use App\Traits\UniqueCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

// use Modules\Reimbuse\Database\Factories\ReimburseFactory;

class Reimburse extends Model
{
    use HasFactory, UniqueCode, SoftDeletes;

    protected $guarded = ['id'];
    protected $primaryKey = 'rn';
    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        // Generate unique 'rn' before creating the model
        static::creating(function ($reimburse) {
            $reimburse->rn = self::generateUniqueRn();
        });
    }

    /**
     * Generate a unique RN code.
     *
     * @return string
     */
    private static function generateUniqueRn()
    {
        do {
            // Generate a random string (e.g., 10 characters long)
            $rn = Str::random(10);
        } while (self::where('rn', $rn)->exists());

        return $rn;
    }

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        "rn", //request number
        "group", // group for combine reimburse
        "type", // reimburse type or purpose
        "requester", // guy who ask reimburse
        "remark", // reimburse detail (free text)
        "balance",
        "receipt_date",
        "start_date",
        "end_date",
        "start_balance_date",
        "end_balance_date",
        "currency",
    ];

    public function users()
    {
        return $this->hasOne(User::class, 'nip', 'requester');
    }

    // protected static function newFactory(): ReimburseFactory
    // {
    //     // return ReimburseFactory::new();
    // }
}
