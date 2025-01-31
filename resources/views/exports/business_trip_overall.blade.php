<!DOCTYPE html>
<html>
<head>
    <title>Business Trip Report</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h2 style="text-align: center;">Business Trip Request Detail Report</h2>

    <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>Employee No</th>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Division</th>
                <th>Requested By</th>
                <th>Date</th>
                <th>Request No</th>
                <th>Status</th>
                <th>Purpose</th>
                <th>Remarks</th>
                <th>Destination</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Allowance Item</th>
                <th>Currency</th>
                <th>Amount</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $index => $trip)
                @foreach ($trip['destinations'] as $destination)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $trip['employee']->employee_no ?? '' }}</td>
                        <td>{{ $trip['employee']->name ?? '' }}</td>
                        <td>{{ $trip['employee']->positions->name ?? '' }}</td>
                        <td>{{ $trip['employee']->departements->name ?? '' }}</td>
                        <td>{{ $trip['employee']->divisions->name ?? '' }}</td>
                        <td>{{ $trip['requested_by']->name ?? '' }}</td>
                        <td>{{ \Carbon\Carbon::parse($destination['date'] ?? null)->format('d/m/Y') }}</td>
                        <td>{{ $trip['request_no'] ?? '' }}</td>
                        <td>{{ $trip['status']->name ?? 'Pending' }}</td>
                        <td>{{ $trip['purpose']->name ?? '' }}</td>
                        <td>{{ $trip['remarks'] ?? '' }}</td>
                        <td>{{ $destination['destination'] ?? '' }}</td>
                        <td>{{ \Carbon\Carbon::parse($destination['date'] ?? null)->format('d/m/Y') }}</td>
                        <td>{{ \Carbon\Carbon::parse($destination['date'] ?? null)->format('d/m/Y') }}</td>
                        <td>Gasoline Total</td>
                        <td>IDR</td>
                        <td>{{ $destination['total'] ?? 0 }}</td>
                        <td>{{ $destination['total'] ?? 0 }}</td>
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>
</body>
</html>
