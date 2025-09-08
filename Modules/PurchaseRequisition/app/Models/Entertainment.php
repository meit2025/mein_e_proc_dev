<?php

namespace Modules\PurchaseRequisition\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\PurchaseRequisition\Database\Factories\EntertainmentFactory;

class Entertainment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'purchase_id',
        'header_not',
        'tanggal',
        'tempat',
        'alamat',
        'jenis',
        'nama',
        'posisi',
        'jenis_usaha',
        'jenis_kegiatan',
        'nama_perusahaan'
    ];

    // protected static function newFactory(): EntertainmentFactory
    // {
    //     // return EntertainmentFactory::new();
    // }

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }
}
