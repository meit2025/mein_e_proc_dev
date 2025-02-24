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
                <th>No.</th>
                <th>Employee No</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $index => $trip)
                @foreach ($trip['destinations'] as $destination)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $trip['employee']->nip ?? '' }}</td>
                        <td>{{ $trip['employee']->name ?? '' }}</td>
                        <td>{{ \Carbon\Carbon::parse($destination['date'] ?? null)->format('d/m/Y') }}</td>
                        <td>{{ \Carbon\Carbon::parse($destination['date'] ?? null)->format('h:i') }}</td>
                        <td>{{ $trip['status']->name ?? '-' }}</td>
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>
</body>
</html>
