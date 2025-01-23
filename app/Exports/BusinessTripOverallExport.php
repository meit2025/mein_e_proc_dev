<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class BusinessTripOverallExport implements FromCollection, WithHeadings, WithEvents
{
    public function collection()
    {
        // Ganti ini dengan data dari database Anda
        return collect([
            [
                '12345',
                'Karim',
                'Engineer',
                'Project Dept',
                'Submitted',
                'REQ-001',
                '2023-01-15',
                'Approved',
                'Training',
                'Annual workshop',
                'Jakarta',
                '2023-01-20',
                '2023-01-25',
                'Daily',
                '1,000,000',
            ],
            [
                '67890',
                'Rina',
                'Sales Executive',
                'Sales Dept',
                'Submitted',
                'REQ-002',
                '2023-01-18',
                'Pending',
                'Client Meeting',
                'Product discussion',
                'Bandung',
                '2023-01-22',
                '2023-01-24',
                'Daily',
                '800,000',
            ],
        ]);
    }

    public function headings(): array
    {
        return [
            'Employee No',
            'Employee Name',
            'Position',
            'Dept',
            'Status',
            'Request No',
            'Request Date',
            'Approval Status',
            'Purpose Type',
            'Reason',
            'Destination',
            'Start Date',
            'End Date',
            'Allowance Type',
            'Allowance Total',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;
                $sheet->getDelegate()->getStyle('A1:O1')->applyFromArray([
                    'font' => ['bold' => true],
                    'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                ]);

                // Set auto-size for columns
                foreach (range('A', 'O') as $col) {
                    $sheet->getDelegate()->getColumnDimension($col)->setAutoSize(true);
                }

                // Add borders to data rows
                $sheet->getDelegate()->getStyle('A2:O3')->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                ]);

                // Merge cells for "Business Trip Reimbursement" example
                $sheet->getDelegate()->mergeCells('L1:O1');
                $sheet->getDelegate()->setCellValue('L1', 'Business Trip Reimbursement');
                $sheet->getDelegate()->getStyle('L1:O1')->applyFromArray([
                    'font' => ['bold' => true],
                    'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                ]);
            },
        ];
    }
}
