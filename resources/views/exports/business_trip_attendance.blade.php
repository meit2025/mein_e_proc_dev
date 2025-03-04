<!DOCTYPE html>
<html>

<head>
    <title>Business Attendance Report</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
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
                {{-- <th>No.</th> --}}
                <th>Employee No</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $i => $attendance)
                @foreach ($attendance as $i2 => $io)
                    <tr>
                        {{-- <td>{{ $i }}</td> --}}
                        <td>{{ $io['employee_no'] ?? '' }}</td>
                        <td>{{ $io['employee_name'] ?? '' }}</td>
                        <td>{{ $io['date'] ?? '' }}</td>
                        <td>{{ $io['time'] ?? '' }}</td>
                        <td>{{ $io['status'] ?? '' }}</td>
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>
</body>

</html>
