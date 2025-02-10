<table>
    <thead>
        <tr>
            <th>No.</th>
            <th>Request No.</th>
            <th>Request For Emp No</th>
            <th>Request For Emp Name</th>
            <th>Type Of Reimbursement</th>
            <th>Request Date</th>
            <th>Claim Date</th>
            <th>Approved Date</th>
            <th>Currency</th>
            <th>Reimburse Cost</th>
            <th>Approved Cost</th>
            <th>Type Of Expense</th>
            <th>Remark</th>
            <th>Additional Field</th>
            <th>Request Status</th>
            <th>Paid Status</th>
            <th>Paid Date</th>
            <th>Source</th>
            <th>Cancels</th>
            <th>Status</th>
            <th>Total Balance</th>
            <th>Outstanding Balance</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data as $key => $item)
            @php
                $form_count = count($item['reimburses']);
            @endphp
            @foreach ($item['reimburses'] as $index => $reim)
                @php
                    $statusPaid = isset($item['pr'][$key]) && $item['pr'][$key]['is_closed'] == 'S' ? "Paid" : "Unpaid";
                    $totalBalance = $reim['reimburseType']['grade_option'] == 'all' ? $reim['reimburseType']['grade_all_price'] : $reim['reimburseType']['gradeReimburseTypes']['plafon'];
                @endphp
                <tr>
                    @if ($index === 0)
                        <td rowspan="{{ $form_count }}">{{ $key + 1 }}</td>
                        <td rowspan="{{ $form_count }}">{{ $item['code'] }}</td>
                        <td rowspan="{{ $form_count }}">{{ $item['employee_no'] }}</td>
                        <td rowspan="{{ $form_count }}">{{ $item['employee_name'] }}</td>
                    @endif
                    <td>{{ $reim['reimburseType']['name'] }}</td>
                    <td>{{ $item['request_date'] }}</td>
                    <td>{{ $item['claim'] }}</td>
                    <td>{{ $item['status'] == 'Fully Approve' ? $item['claim'] : "-" }}</td>
                    <td>{{ $item['curency'] }}</td>
                    <td>{{ $reim['balance'] }}</td>
                    <td>{{ $item['status'] == 'Fully Approve' ? $reim['balance'] : "-" }}</td>
                    <td>{{ $item['type_of_expense'] }}</td>
                    <td>{{ $item['remark'] }}</td>
                    <td>{{ $item['additional_field'] }}</td>
                    <td>{{ $item['status'] }}</td>
                    <td>{{ $statusPaid }}</td>
                    <td>{{ $statusPaid == 'Paid' ? $item['claim'] : "" }}</td>
                    <td>{{ $item['source'] }}</td>
                    <td>{{ $item['cancels'] }}</td>
                    <td>{{ $item['status'] }}</td>
                    <td>{{ $totalBalance }}</td>
                    <td>{{ ($totalBalance - $reim['balance']) }}</td>
                </tr>
            @endforeach
        @endforeach
        <tr>
            <td colspan="8">Grand Total</td>
            <td></td>
            <td>{{ $data->sum('balance') }}</td>
            <td>{{ $data->sum('balance') }}</td>
            <td colspan="9"></td>
        </tr>
    </tbody>
</table>
