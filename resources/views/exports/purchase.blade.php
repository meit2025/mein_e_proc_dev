<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid black;
            padding: 5px;
            text-align: left;
        }
        th {
            background-color: #d9ead3;
            text-align: center;
        }
    </style>
</head>
<body>
    <table>
        <thead>
            <tr>
                <th rowspan="2">Purchase Requisition No.</th>
                <th rowspan="2">Purchase Order No.</th>
                <th rowspan="2">Quotation No.</th>
                <th rowspan="2">Request by</th>
                <th rowspan="2">Requester</th>
                <th rowspan="2">Document Type</th>
                <th rowspan="2">Purchasing Group</th>
                <th rowspan="2">Cost Center</th>
                <th rowspan="2">Delivery Date</th>
                <th rowspan="2">Receiving Location</th>
                <th rowspan="2">Header Note</th>
                <th colspan="9">Document Type Entertainment</th>
                <th rowspan="2">Status</th>
                <th rowspan="2">Number PR</th>
                <th rowspan="2">Status PR</th>
                <th rowspan="2">Status PO</th>
                <th rowspan="2">Currency</th>
                <th rowspan="2">Attachment</th>
                <th rowspan="2">Created At</th>
                <th rowspan="2">Total Vendor Comparison</th>
                <th rowspan="2">Select Vendor</th>
                <th colspan="9">Item Detail</th>
                <th colspan="3">Cash Advanced</th>
            </tr>
            <tr>
                <th>Entertainment Date</th>
                <th>Entertainment Location</th>
                <th>Entertainment Address</th>
                <th>Type of Entertainment</th>
                <th>Company Name</th>
                <th>Entertained Name</th>
                <th>Entertained Position</th>
                <th>Type of Business</th>
                <th>Type of Activity</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
                <th>Account Assignment</th>
                <th>Material Group</th>
                <th>Material Number</th>
                <th>UOM</th>
                <th>Tax On Sales</th>
                <th>Short Text</th>
                <th>Percentage</th>
                <th>Amount Cash Advanced</th>
                <th>Reference</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
                @php $itemCount = count($row['items']); @endphp
                @foreach($row['items'] as $index => $item)
                    <tr>
                        @if($index === 0)
                            <td rowspan="{{ $itemCount }}">{{ $row['po_no'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['pr_no'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['quatation_no'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['requested_by'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['requester'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['document_type'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['purchasing_groups'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['cost_center'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['delivery_date'] ? \Carbon\Carbon::parse($row['delivery_date'])->format('d-m-Y') : '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['storage_locations'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['header_note'] ?? '-' }}</td>

                            {{-- Entertainment --}}
                            <td rowspan="{{ $itemCount }}">{{ $row['tanggal_entertainment'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['tempat_entertainment'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['alamat_entertainment'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['jenis_entertainment'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['nama_entertainment'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['posisi_entertainment'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['nama_perusahaan'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['jenis_usaha_entertainment'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['jenis_kegiatan_entertainment'] ?? '-' }}</td>

                            <td rowspan="{{ $itemCount }}">{{ $row['status'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['number_pr'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['status_pr'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['status_po'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['currency'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['attachment'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['created_at'] ? \Carbon\Carbon::parse($row['created_at'])->format('d-m-Y') : '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['total_vendor'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['propose_vendor'] ?? '-' }}</td>
                        @endif
                        <td>{{ $item['qty'] ?? '0' }}</td>
                        <td>{{ is_numeric($item['unit_price']) ? number_format((float) $item['unit_price'], 2, ',', '.') : '0,00' }}</td>
                        <td>{{ is_numeric($item['total_amount']) ? number_format($item['total_amount'] , 2, ',', '.') : '0,00' }}</td>
                        <td>{{ $item['account_assignment'] ?? '-' }}</td>
                        <td>{{ $item['material_group'] ?? '-' }}</td>
                        <td>{{ $item['material_number'] ?? '-' }}</td>
                        <td>{{ $item['uom'] ?? '-' }}</td>
                        <td>{{ is_numeric($item['tax']) ? number_format((float) $item['tax'], 2, ',', '.') : '0,00' }}</td>
                        <td>{{ $item['short_text'] ?? '-' }}</td>
                        @if($index === 0)
                            <td rowspan="{{ $itemCount }}">{{ $row['percentage'] ?? '-' }}</td>
                            <td rowspan="{{ $itemCount }}">{{is_numeric($row['amount']) ?  number_format((float) $row['amount'], 2, ',','.') : '0,00' }}</td>
                            <td rowspan="{{ $itemCount }}">{{ $row['reference'] ?? '-' }}</td>
                        @endif
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>
</body>
</html>
