<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Modules\Reimbuse\Models\ReimburseGroup;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReimburseExport implements FromView, WithStyles
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
        return view('exports.employee_reimbursement', [
            'data' => $this->data
        ]);
    }

    // public function collection()
    // {
    //     $numberedData = $this->data->map(function ($item, $index) {
    //         return array_merge(['Nomor' => $index + 1], $item);
    //     });

    //     return collect($numberedData);
    // }

    // public function headings(): array
    // {
    //     return [
    //         'No',
    //         'Request No',
    //         'Reimburse For',
    //         'Remark',
    //         'Total Balance',
    //         'Reimburse Form',
    //         'Status',
    //         'Date',
    //     ];
    // }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:V1')->getFont()->setBold(true); // Contoh: Header dengan font tebal
        $sheet->getStyle('A:V')->getAlignment()->setHorizontal('center'); // Rata tengah seluruh kolom

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
