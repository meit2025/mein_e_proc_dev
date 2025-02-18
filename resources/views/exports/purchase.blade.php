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
                <th rowspan="2">Purchase Requistion No,</th>
                <th rowspan="2">Purchase Order No.</th>
                <th rowspan="2">Quotation No.</th>
                <th rowspan="2">Request by</th>
                <th rowspan="2">Requester</th>
                <th rowspan="2">Document Type</th>
                <th rowspan="2">Purchasing Group</th>
                <th rowspan="2">Cost Center</th>
                <th rowspan="2">Delivery Date</th>
                <th rowspan="2">Recieving Location</th>
                <th rowspan="2">Total Vendor Comparison</th>
                <th rowspan="2">Attachment</th>
                <th rowspan="2">Propose Vendor</th>
                <th rowspan="2">Status PR</th>
                <th rowspan="2">Status PO</th>
                <th rowspan="2">PO Date</th>
                <th rowspan="2">Currency</th>
                <th rowspan="2">Request Date</th>
                <th rowspan="2">Created At</th>
                <th colspan="3">Cash Advanced</th>
                <th colspan="8">Item Detail</th>
            </tr>
            <tr>
                <th>Percentage</th>
                <th>Amount Cash Advanced</th>
                <th>Reference</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Account Assignment</th>
                <th>Material Group</th>
                <th>Material Number</th>
                <th>UOM</th>
                <th>Tax On Sales</th>
                <th>Short Text</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
                <tr>
                    <td>{{ $row['po_no'] ?? '-' }}</td>
                    <td>{{ $row['pr_no'] ?? '-' }}</td>
                    <td>{{ $row['quatation_no'] ?? '-' }}</td>
                    <td>{{ $row['requested_by'] ?? '-' }}</td>
                    <td>{{ $row['requester'] ?? '-' }}</td>
                    <td>{{ $row['document_type'] ?? '-' }}</td>
                    <td>{{ $row['purchasing_groups'] ?? '-' }}</td>
                    <td>{{ $row['cost_center'] ?? '-' }}</td>
                    <td>{{ $row['delivery_date'] ? \Carbon\Carbon::parse($row['delivery_date'])->format('d-m-Y') : '-' }}</td>
                    <td>{{ $row['storage_locations'] ?? '-' }}</td>
                    <td>{{ $row['total_vendor'] ?? '-' }}</td>
                    <td>{{ $row['attachment'] ?? '-' }}</td>
                    <td>{{ $row['propose_vendor'] ?? '-' }}</td>
                    <td>{{ $row['status_pr'] ?? '-' }}</td>
                    <td>{{ $row['status_po'] ?? '-' }}</td>
                    <td>{{ $row['po_date'] ? \Carbon\Carbon::parse($row['po_date'])->format('d-m-Y') : '-' }}</td>
                    <td>{{ $row['currency'] ?? '-' }}</td>
                    <td>{{ $row['request_date'] ? \Carbon\Carbon::parse($row['request_date'])->format('d-m-Y') : '-' }}</td>
                    <td>{{ $row['created_at'] ? \Carbon\Carbon::parse($row['created_at'])->format('d-m-Y') : '-' }}</td>
                    <td>{{ $row['amount'] !== null ? number_format($row['amount'], 2, ',', '.') : '0,00' }}</td>
                    <td>{{ $row['percentage'] !== null ? number_format($row['percentage'], 2, ',', '.') . '%' : '0,00%' }}</td>
                    <td>{{ $row['reference'] ?? '-' }}</td>
                    <td>{{ $row['qty'] ?? '0' }}</td>
                    <td>{{ $row['unit_price'] !== null ? number_format($row['unit_price'], 2, ',', '.') : '0,00' }}</td>
                    <td>{{ $row['account_assignment'] ?? '-' }}</td>
                    <td>{{ $row['material_group'] ?? '-' }}</td>
                    <td>{{ $row['material_number'] ?? '-' }}</td>
                    <td>{{ $row['uom'] ?? '-' }}</td>
                    <td>{{ $row['tax'] !== null ? number_format($row['tax'], 2, ',', '.') : '0,00' }}</td>
                    <td>{{ $row['short_text'] ?? '-' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
