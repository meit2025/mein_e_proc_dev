<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Approval\Models\ApprovalPr;

// use Modules\Master\Database\Factories\DocumentTypeFactory;

class DocumentType extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'purchasing_doc',
        'purchasing_dsc',
    ];

    // protected static function newFactory(): DocumentTypeFactory
    // {
    //     // return DocumentTypeFactory::new();
    // }

    public function approvalPr()
    {
        return $this->belongsTo(ApprovalPr::class);
    }
}
