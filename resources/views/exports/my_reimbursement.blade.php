<table>
    <thead>
        <tr>
            <th>No.</th>
            <th>Reimburse Type</th>
            <th>For</th>
            <th>Employee Name</th>
            <th>Family Name</th>
            <th>Currency</th>
            <th>Maximum Balance</th>
            <th>Total Reimbursement Paid</th>
            <th>Total Reimbursement Unpaid</th>
            <th>Remaining Balance</th>
            <th>Last Claim Date</th>
            <th>Available Claim Date</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data as $key => $item)
            <tr>
                <td>{{ $key + 1 }}</td>
                <td>{{ $item['reimburseType'] }}</td>
                <td>{{ $item['isEmployee'] == 1 ? 'Employee' : 'Family' }} ({{ $item['familyStatus'] }})</td>
                <td>{{ $item['employeeName'] }}</td>
                <td>{{ $item['familyName'] }}</td>
                <td>{{ $item['currency'] }}</td>
                <td>{{ $item['maiximumBalance'] }}</td>
                <td>{{ $item['totalPaid'] }}</td>
                <td>{{ $item['totalUnpaid'] }}</td>
                <td>{{ $item['remainingBalance'] }}</td>
                <td>{{ $item['lastClaimDate'] }}</td>
                <td>{{ $item['availableClaimDate'] }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
