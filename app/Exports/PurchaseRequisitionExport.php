<?php

namespace App\Exports;

use App\Models\Purchase;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PurchaseRequisitionExport implements FromView, WithStyles, ShouldAutoSize
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function view(): View
    {
        return view(
            'exports.purchase',
            ['data' => $this->data]
        );
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:AO1')->getFont()->setBold(true); // Contoh: Header dengan font tebal
        $sheet->getStyle('A:AO')->getAlignment()->setHorizontal('center'); // Rata tengah seluruh kolom

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
