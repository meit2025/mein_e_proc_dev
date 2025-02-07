<?php

namespace App\Exports;

use App\Models\Purchase;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PurchaseRequisitionExport implements FromView
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    // public function collection()
    // {
    //     $numberedData = $this->data->map(function ($item, $index) {
    //         // Ensure $item is an array
    //         $itemArray = (array) $item;

    //         // Merge the array with the numbering
    //         return array_merge(['Nomor' => $index + 1], $itemArray);
    //     });

    //     return collect($numberedData);
    // }

    // public function headings(): array
    // {
    //     return [
    //         'No',
    //         'Purchase Number',
    //         'Request For',
    //         'Document type',
    //         'Purchasing groups',
    //         'Delivery date',
    //         'Storage locations',
    //         'Total Vendor',
    //         'Total Item',
    //         'Status',
    //         'Requester By',
    //         'Created At',
    //         'Number PO',
    //         'Number PR',
    //     ];
    // }

    public function view(): View
    {
        return view(
            'exports.purchase',
            ['data' => $this->data]
        );
    }

    public function styles(Worksheet $sheet)
    {
        // Style headers
        $sheet->getStyle('A1:AD1')->applyFromArray([
            'font' => ['bold' => true],
        ]);
        $sheet->getStyle('A2:AD2')->applyFromArray([
            'font' => ['bold' => true],
        ]);

        $sheet->getStyle('A:AD')->getAlignment()->setHorizontal('center'); // Rata tengah seluruh kolom

        // Tambahkan border untuk semua data
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();

        $sheet->getStyle("A1:$highestColumn$highestRow")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['argb' => '000000'], // Hitam
                ],
            ],
        ]);
        return [];
    }
}
