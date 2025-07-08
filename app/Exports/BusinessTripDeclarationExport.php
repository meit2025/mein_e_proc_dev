<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;

class BusinessTripDeclarationExport implements FromArray, WithHeadings, WithEvents, WithCustomStartCell, ShouldAutoSize
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function startCell(): string
    {
        return 'A1';
    }

    public function array(): array
    {
        $exportData = [];
        foreach ($this->data as $index => $businessTrip) {
            $firstRow = true; // To track the first row for each business trip
            foreach ($businessTrip['destinations'] ?? [] as $destination) {
                foreach ($destination['allowance_items'] ?? [] as $allowanceItem) {
                    $baseData = [
                        'No' => $firstRow ? $index + 1 : '',
                        'Employee No' => $firstRow ? ($businessTrip['requestedBy']->nip ?? '') : '',
                        'Employee Name' => $firstRow ? ($businessTrip['requestedBy']->name ?? '') : '',
                        'Position' => $firstRow ? ($businessTrip['requestedBy']->positions->name ?? '') : '',
                        'Dept' => $firstRow ? ($businessTrip['requestedBy']->departements->name ?? '') : '',
                        'Division' => $firstRow ? ($businessTrip['requestedBy']->divisions->name ?? '') : '',
                        'Requested By' => $firstRow ? ($businessTrip['requestFor']->name ?? '') : '',
                        'Request Date' => $firstRow ? $businessTrip['requestDate']?->format('d/m/Y') : '',
                        'Request Number' => $firstRow ? ($businessTrip['requestNo'] ?? '') : '',
                        'Request Status' => $firstRow ? ($businessTrip['status']->name ?? '') : '',
                        'Purpose Type' => $firstRow ? ($businessTrip['purposeType']->name ?? '') : '',
                        'Remarks' => $firstRow ? ($businessTrip['remarks'] ?? '') : '',
                        'Destination' => ($destination['destination'] ?? ''),
                        'Start Date' => (isset($destination['start_date']) ? date('d/m/Y', strtotime($destination['start_date'])) : ''),
                        'End Date' => (isset($destination['end_date']) ? date('d/m/Y', strtotime($destination['end_date'])) : ''),
                        'Allowance Item' => $allowanceItem['item_name'] ?? '',
                        'Allowance Value' => isset($allowanceItem['currency_id'], $allowanceItem['amount'])
                            ? $allowanceItem['currency_id'] . ' ' . number_format($allowanceItem['amount'], 0, ',', '.')
                            : '',
                        'Total Allowance' => '',
                    ];

                    $exportData[] = $baseData;
                    $firstRow = false; // Mark subsequent rows as not the first row
                }

                // Add total allowance row for the destination
                $exportData[] = [
                    'No' => '',
                    'Employee No' => '',
                    'Employee Name' => '',
                    'Position' => '',
                    'Dept' => '',
                    'Division' => '',
                    'Requested By' => '',
                    'Request Date' => '',
                    'Request Number' => '',
                    'Request Status' => '',
                    'Purpose Type' => '',
                    'Remarks' => '',
                    'Destination' => '',
                    'Start Date' => '',
                    'End Date' => '',
                    'Allowance Item' => '',
                    'Allowance Value' => '',
                    'Total Allowance' => isset($destination['total_allowance'], $allowanceItem['currency_id'])
                        ? $allowanceItem['currency_id'] . ' ' . number_format($destination['total_allowance'], 0, ',', '.')
                        : '',
                ];
            }
        }

        return $exportData;
    }


    public function headings(): array
    {
        return [
            'No',
            'Employee No',
            'Employee Name',
            'Position',
            'Dept',
            'Division',
            'Requested By',
            'Request Date',
            'Request Number',
            'Request Status',
            'Purpose Type',
            'Remarks',
            'Destination',
            'Start Date',
            'End Date',
            'Allowance Item',
            'Allowance Value',
            'Total Allowance',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;

                // Style the headers
                $sheet->getStyle('A1:R1')->applyFromArray([
                    'font' => ['bold' => true],
                ]);

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
