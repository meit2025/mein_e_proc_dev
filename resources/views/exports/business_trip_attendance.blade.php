<!DOCTYPE html>
<html>
<head>
    <title>Business Attendance Report</title>
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
            @foreach ($data as $index => $attendance)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $attendance['employee_no'] ?? '' }}</td>
                        <td>{{ $attendance['employee_name'] ?? '' }}</td>
                        <td>{{ $attendance['date'] ?? '' }}</td>
                        <td>{{ $attendance['time'] ?? '' }}</td>
                        <td>{{ $attendance['status'] ?? '' }}</td>
                    </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
