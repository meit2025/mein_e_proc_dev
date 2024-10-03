<?php

namespace Modules\Reimbuse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Reimbuse\Database\Factories\ReimburseAttachmentFactory;

class ReimburseAttachment extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ["reimburse", "url"];

    // protected static function newFactory(): ReimburseAttachmentFactory
    // {
    //     // return ReimburseAttachmentFactory::new();
    // }
}
