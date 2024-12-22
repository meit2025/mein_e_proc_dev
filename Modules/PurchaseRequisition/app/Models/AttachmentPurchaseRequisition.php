<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\PurchaseRequisition\Database\Factories\AttachmentPurchaseRequisitionFactory;

class AttachmentPurchaseRequisition extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'file_name',
        'file_path',
        'purchase_id',
    ];

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    public function getFilePathAttribute()
    {
        $baseUrl = env('APP_URL'); // Mengambil base URL dari file .env
        return $baseUrl . '/' . $this->attributes['file_path'];
    }
}
