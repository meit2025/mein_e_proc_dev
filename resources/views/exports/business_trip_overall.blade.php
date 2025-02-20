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
    <table>
        <thead>
            <tr>
                <th rowspan="2">No.</th>
                <th rowspan="2">Employee No</th>
                <th rowspan="2">Employee Name</th>
                <th rowspan="2">Position</th>
                <th rowspan="2">Dept</th>
                <th rowspan="2">Division</th>
                <th rowspan="2">Requested By</th>
                <th rowspan="2">Request Date</th>
                <th colspan="6">Business Trip</th>
                <th colspan="3">Business Trip Declaration</th>
            </tr>
            <tr>
                <th>Request Number</th>
                <th>Request Status</th>
                <th>Purpose Type</th>
                <th>Destination</th>
                <th>Start Date</th>
                <th>End Date</th>

                <th>Request Number</th>
                <th>Request Status</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $index => $trip)
                @foreach ($trip['destinations'] as $destination)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $trip['employee']->nip ?? '' }}</td>
                        <td>{{ $trip['employee']->name ?? '' }}</td>
                        <td>{{ $trip['employee']->positions->name ?? '' }}</td>
                        <td>{{ $trip['employee']->departements->name ?? '' }}</td>
                        <td>{{ $trip['employee']->divisions->name ?? '' }}</td>
                        <td>{{ $trip['requested_by']->name ?? '' }}</td>
                        <td>{{ \Carbon\Carbon::parse($destination['date'] ?? null)->format('d/m/Y') }}</td>

                        @if ($trip['is_declaration'])
                        <td>{{ $trip['request_no_parent'] ?? '' }}</td>
                        <td>{{ $trip['status']->name ?? 'Pending' }}</td>
                        <td>{{ $trip['purpose']->name ?? '' }}</td>
                        <td>{{ $destination['destination'] ?? '' }}</td>
                        <td>{{ \Carbon\Carbon::parse($destination['start_date'] ?? null)->format('d/m/Y') }}</td>
                        <td>{{ \Carbon\Carbon::parse($destination['end_date'] ?? null)->format('d/m/Y') }}</td>

                        <td>{{ $trip['request_no'] ?? '' }}</td>
                        <td>{{ $trip['status']->name ?? 'Pending' }}</td>
                        <td>{{ \Carbon\Carbon::parse($destination['date'] ?? null)->format('d/m/Y') }}</td>
                        @else
                        <td>{{ $trip['request_no'] ?? '' }}</td>
                        <td>{{ $trip['status']->name ?? 'Pending' }}</td>
                        <td>{{ $trip['purpose']->name ?? '' }}</td>
                        {{-- <td>{{ $trip['remarks'] ?? '' }}</td> --}}
                        <td>{{ $destination['destination'] ?? '' }}</td>
                        <td>{{ \Carbon\Carbon::parse($destination['start_date'] ?? null)->format('d/m/Y') }}</td>
                        <td>{{ \Carbon\Carbon::parse($destination['end_date'] ?? null)->format('d/m/Y') }}</td>
                        <td colspan="3">N/A</td>
                        @endif
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>
</body>
</html>
