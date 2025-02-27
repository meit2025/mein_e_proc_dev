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
                <th colspan="6">Business Trip Request</th>
                <th colspan="5">Business Trip Declaration</th>
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
                <th>Request Date</th>
                <th>Start Date</th>
                <th>End Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $index => $trip)
                @php
                    $destinationCount = count($trip['destinations']);
                @endphp

                @foreach ($trip['destinations'] as $destinationIndex => $destination)
                    <tr>
                        @if ($destinationIndex === 0) {{-- Tampilkan hanya di baris pertama perjalanan --}}
                            <td rowspan="{{ $destinationCount }}">{{ $index + 1 }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ $trip['employee']->nip ?? '' }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ $trip['employee']->name ?? '' }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ $trip['employee']->positions->name ?? '' }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ $trip['employee']->departements->name ?? '' }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ $trip['employee']->divisions->name ?? '' }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ $trip['requested_by']->name ?? '' }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ \Carbon\Carbon::parse($trip['request_date'] ?? null)->format('d/m/Y') }}</td>
                        @endif

                        @if ($trip['is_declaration'])
                            <td rowspan="{{ $destinationCount }}">{{ $trip['request_no_parent'] ?? '' }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ 'Fully Approve' }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ $trip['purpose']->name ?? '' }}</td>
                            <td>{{ $destination['destination'] ?? '' }}</td>
                            <td>{{ \Carbon\Carbon::parse($destination['start_date'] ?? null)->format('d/m/Y') }}</td>
                            <td>{{ \Carbon\Carbon::parse($destination['end_date'] ?? null)->format('d/m/Y') }}</td>

                            <td rowspan="{{ $destinationCount }}">{{ $trip['request_no'] ?? '' }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ $trip['status']->name ?? 'Pending' }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ \Carbon\Carbon::parse($trip['request_date'] ?? null)->format('d/m/Y') }}</td>
                            <td>{{ \Carbon\Carbon::parse($destination['start_date'] ?? null)->format('d/m/Y') }}</td>
                            <td>{{ \Carbon\Carbon::parse($destination['end_date'] ?? null)->format('d/m/Y') }}</td>
                        @else
                            <td rowspan="{{ $destinationCount }}">{{ $trip['request_no'] ?? '' }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ $trip['status']->name ?? 'Pending' }}</td>
                            <td rowspan="{{ $destinationCount }}">{{ $trip['purpose']->name ?? '' }}</td>
                            <td>{{ $destination['destination'] ?? '' }}</td>
                            <td>{{ \Carbon\Carbon::parse($destination['start_date'] ?? null)->format('d/m/Y') }}</td>
                            <td>{{ \Carbon\Carbon::parse($destination['end_date'] ?? null)->format('d/m/Y') }}</td>
                            <td colspan="5">N/A</td>
                        @endif
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>
</body>
</html>
