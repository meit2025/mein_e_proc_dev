<?php

namespace App\Exports;

use App\Models\Purchase;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PurchaseRequisitionExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        $numberedData = $this->data->map(function ($item, $index) {
            // Ensure $item is an array
            $itemArray = (array) $item;

            // Merge the array with the numbering
            return array_merge(['Nomor' => $index + 1], $itemArray);
        });

        return collect($numberedData);
    }

    public function headings(): array
    {
        return [
            'No',
            'Purchase Number',
            'Request For',
            'Document type',
            'Purchasing groups',
            'Delivery date',
            'Storage locations',
            'Total Vendor',
            'Total Item',
            'Status',
            'Requester By',
            'Created At',
            'Number PO',
            'Number PR',
        ];
    }
}
