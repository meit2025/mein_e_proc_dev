<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class BusinessTripDeclarationExport implements FromCollection, WithHeadings
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
            return array_merge(['Nomor' => $index + 1], $item);
        });

        return collect($numberedData);
    }

    public function headings(): array
    {
        return [
            'No',
            'Declaration Number',
            'Request Number',
            'Request For',
            'Request Date',
            'Remarks',
            'Status',
        ];
    }
}
