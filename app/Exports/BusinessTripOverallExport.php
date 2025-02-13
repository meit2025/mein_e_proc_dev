<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use Illuminate\Contracts\View\View;

class BusinessTripOverallExport implements FromView, WithEvents
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function view(): View
    {
        return view('exports.business_trip_overall', ['data' => $this->data]);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;

                $headerRanges = ['A1:Q1', 'A2:Q2'];
                foreach ($headerRanges as $range) {
                    $sheet->getDelegate()->getStyle($range)->getFont()->setBold(true);
                }

                // Menambahkan border ke seluruh tabel
                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();
                $tableRange = 'A1:' . $highestColumn . $highestRow;
                $sheet->getDelegate()->getStyle($tableRange)->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

                // Menjadikan semua teks rata tengah
                $sheet->getDelegate()->getStyle($tableRange)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            },
        ];
    }
}
