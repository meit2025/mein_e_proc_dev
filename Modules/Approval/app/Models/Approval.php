<?php

namespace Modules\Approval\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Approval\Database\Factories\ApprovalFactory;

class Approval extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'is_status',
        'message',
        'document_id',
        'document_name',
        'status'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // protected static function newFactory(): ApprovalFactory
    // {
    //     // return ApprovalFactory::new();
    // }
}
