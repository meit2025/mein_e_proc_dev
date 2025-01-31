<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Carbon\Carbon;


use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class BusinessTripOverallExport implements FromView
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
}

// class BusinessTripOverallExport implements FromCollection, WithColumnFormatting, WithEvents
// {
//     protected $data;
//     protected $totalColumns = 33; // A-AG (33 kolom)

//     public function __construct($data)
//     {
//         $this->data = $data;
//     }

//     public function collection()
//     {
//         $rows = [];
//         $counter = 1;

//         foreach ($this->data as $trip) {
//             foreach ($trip['destinations'] as $destination) {
//                 // Data dasar (8 kolom pertama)
//                 $baseData = [
//                     $counter++,
//                     $trip['employee']->employee_no ?? '',
//                     $trip['employee']->name ?? '',
//                     $trip['employee']->positions->name ?? '',
//                     $trip['employee']->departements->name ?? '',
//                     $trip['employee']->divisions->name ?? '',
//                     $trip['requested_by']->name ?? '',
//                     $this->formatDate($destination['date'] ?? null), // Kolom H
//                 ];

//                 // Data request atau declaration
//                 $rowData = $this->generateRowData($trip, $destination, $baseData);

//                 // Pastikan total 33 kolom
//                 $rows[] = array_pad($rowData, $this->totalColumns, '');

//                 // Tambahkan allowance rows untuk request
//                 if ($trip['type'] === 'request') {
//                     $rows[] = $this->createAllowanceRow('Other', $destination);
//                     $rows[] = $this->createAllowanceRow('Parking', $destination);
//                     $rows[] = $this->createAllowanceRow('Toll', $destination);
//                 }
//             }
//         }

//         return collect($rows);
//     }

//     private function formatDate($date)
//     {
//         if (!$date) return '';

//         try {
//             return Carbon::parse($date)->format('d/m/Y');
//         } catch (\Exception $e) {
//             return '';
//         }
//     }

//     private function generateRowData($trip, $destination, $baseData)
//     {
//         if ($trip['type'] === 'request') {
//             return array_merge($baseData, [
//                 // Request Section (Kolom I-S)
//                 $trip['request_no'],
//                 $trip['status']->name ?? 'Pending',
//                 $trip['purpose']->name ?? '',
//                 $trip['remarks'],
//                 $destination['destination'],
//                 $this->formatDate($destination['date']), // Kolom N
//                 $this->formatDate($destination['date']), // Kolom O
//                 'Gasoline Total [TOTAL]',
//                 'IDR',
//                 $this->findAllowanceAmount($destination['allowances'], 'Gasoline'),
//                 'IDR',
//                 $destination['total'] ?? 0,
//                 'N/A',
//                 '',
//                 '', // Kolom T-V
//                 ...array_fill(0, 11, '') // Kolom W-AG
//             ]);
//         }

//         // Declaration Section
//         return array_merge($baseData, [
//             ...array_fill(0, 11, ''), // Kolom I-S
//             'DCLR-' . $trip['request_no'],
//             $trip['status']->name ?? 'Pending',
//             $trip['remarks'],
//             $destination['destination'],
//             $this->formatDate($destination['date']), // Kolom Z
//             'Gasoline Total [TOTAL]',
//             'IDR',
//             $this->findAllowanceAmount($destination['allowances'], 'Gasoline'),
//             'IDR',
//             $destination['total'] ?? 0,
//             ...array_fill(0, 2, '')
//         ]);
//     }

//     private function findAllowanceAmount($items, $type)
//     {
//         foreach ($items as $item) {
//             if (stripos($item['item_name'], $type) !== false) {
//                 return $item['amount'] ?? 0;
//             }
//         }
//         return 0;
//     }

//     private function createAllowanceRow($type, $destination)
//     {
//         return array_pad(
//             [
//                 ...array_fill(0, 14, ''),
//                 $type . ' Allowances [TOTAL]',
//                 'IDR',
//                 $this->findAllowanceAmount($destination['allowances'], $type),
//                 'IDR',
//                 $this->findAllowanceAmount($destination['allowances'], $type),
//                 ...array_fill(0, 14, '')
//             ],
//             $this->totalColumns,
//             ''
//         );
//     }

//     public function headings(): array
//     {
//         return [];
//     }

//     public function registerEvents(): array
//     {
//         return [
//             AfterSheet::class => function (AfterSheet $event) {
//                 // Header Utama
//                 $this->applyMainHeader($event);

//                 // Header Kolom
//                 $this->applyColumnHeaders($event);

//                 // Lebar Kolom
//                 $this->applyColumnWidths($event);

//                 // Format Global
//                 $this->applyGlobalStyling($event);
//             }
//         ];
//     }

//     private function applyMainHeader($event)
//     {
//         $event->sheet->mergeCells('A1:AG3');
//         $event->sheet->setCellValue('A1', 'Business Trip Request Detail Report')
//             ->getStyle('A1')
//             ->applyFromArray([
//                 'alignment' => [
//                     'horizontal' => Alignment::HORIZONTAL_CENTER,
//                     'vertical' => Alignment::VERTICAL_CENTER
//                 ],
//                 'font' => [
//                     'bold' => true,
//                     'size' => 16
//                 ]
//             ]);
//     }

//     private function applyColumnHeaders($event)
//     {
//         // Main Headers
//         $event->sheet->setCellValue('A6', 'No.');
//         $event->sheet->mergeCells('A6:A7');

//         $event->sheet->setCellValue('I6', 'Business Trip Request');
//         $event->sheet->mergeCells('I6:S6');

//         $event->sheet->setCellValue('W6', 'Business Trip Declaration');
//         $event->sheet->mergeCells('W6:AG6');

//         // Sub Headers
//         $subHeaders = [
//             'I7' => 'Request Number',
//             'J7' => 'Status',
//             'K7' => 'Purpose',
//             'L7' => 'Reason',
//             'M7' => 'Destination',
//             'N7' => 'Start Date',
//             'O7' => 'End Date',
//             'P7' => 'Allowance Item',
//             'Q7' => 'Currency',
//             'R7' => 'Amount',
//             'S7' => 'Total',

//             'W7' => 'Request Number',
//             'X7' => 'Status',
//             'Y7' => 'Reason',
//             'Z7' => 'Destination',
//             'AA7' => 'Date',
//             'AB7' => 'Allowance Item',
//             'AC7' => 'Currency',
//             'AD7' => 'Amount',
//             'AE7' => 'Total'
//         ];

//         foreach ($subHeaders as $cell => $title) {
//             $event->sheet->setCellValue($cell, $title);
//         }

//         // Styling
//         $event->sheet->getStyle('A6:AG7')->applyFromArray([
//             'borders' => [
//                 'allBorders' => [
//                     'borderStyle' => Border::BORDER_THIN
//                 ]
//             ],
//             'alignment' => [
//                 'horizontal' => Alignment::HORIZONTAL_CENTER,
//                 'vertical' => Alignment::VERTICAL_CENTER
//             ],
//             'font' => [
//                 'bold' => true
//             ]
//         ]);
//     }

//     private function applyColumnWidths($event)
//     {
//         $widths = [
//             'A' => 5,
//             'B' => 12,
//             'C' => 25,
//             'D' => 20,
//             'E' => 18,
//             'F' => 18,
//             'G' => 25,
//             'H' => 15,
//             'I' => 20,
//             'J' => 15,
//             'K' => 20,
//             'L' => 25,
//             'M' => 15,
//             'N' => 15,
//             'O' => 15,
//             'P' => 20,
//             'Q' => 10,
//             'R' => 15,
//             'S' => 15,
//             'W' => 20,
//             'X' => 15,
//             'Y' => 25,
//             'Z' => 15,
//             'AA' => 15,
//             'AB' => 20,
//             'AC' => 10,
//             'AD' => 15,
//             'AE' => 15
//         ];

//         foreach ($widths as $col => $width) {
//             $event->sheet->getColumnDimension($col)->setWidth($width);
//         }
//     }

//     private function applyGlobalStyling($event)
//     {
//         // Format tanggal
//         $event->sheet->getStyle('H:H,N:N,O:O,Z:Z,AA:AA')->getNumberFormat()
//             ->setFormatCode(NumberFormat::FORMAT_DATE_DDMMYYYY);

//         // Format mata uang
//         $currencyStyle = [
//             'numberFormat' => [
//                 'formatCode' => '"IDR"#,##0'
//             ]
//         ];

//         $event->sheet->getStyle('R:R,S:S,AC:AC,AE:AE')->applyFromArray($currencyStyle);
//     }

//     public function columnFormats(): array
//     {
//         return [
//             7  => NumberFormat::FORMAT_DATE_DDMMYYYY,  // H
//             13 => NumberFormat::FORMAT_DATE_DDMMYYYY,  // N
//             14 => NumberFormat::FORMAT_DATE_DDMMYYYY,  // O
//             25 => NumberFormat::FORMAT_DATE_DDMMYYYY,  // Z
//             26 => NumberFormat::FORMAT_DATE_DDMMYYYY,  // AA
//             17 => '"IDR"#,##0', // R
//             18 => '"IDR"#,##0', // S
//             28 => '"IDR"#,##0', // AC
//             30 => '"IDR"#,##0', // AE
//         ];
//     }
// }
