<table>
    <thead>
        {{-- <tr>
            <th colspan="2">Reimbursement Type:</th>
            <td colspan="4">Caesar Child Birth, Glasses, Medical After Maternity, Medical Before Maternity</td>
        </tr>
        <tr>
            <th colspan="2">Request Status:</th>
            <td colspan="4">Fully Approved</td>
        </tr> --}}
    </thead>
    <tbody>
        <tr>
            <th>No.</th>
            <th>Request No.</th>
            <th>Request For Emp No</th>
            <th>Request For Emp Name</th>
            <th>Type Of Reimbursement</th>
            <th>Request Date</th>
            <th>Claim Date</th>
            {{-- <th>Start Date</th>
            <th>End Date</th> --}}
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
        @foreach($data as $key => $item)
        @foreach ($item['reimburses'] as $reim )
        @php
        $statusPaid =  $item['pr']->isNotEmpty() ? $item['pr'][$key]['is_closed'] == 'S' ? "Paid" : "Unpaid" : "Unpaid";
        $totalBalance = $reim['reimburseType']['grade_option'] == 'all' ? $reim['reimburseType']['grade_all_price'] : $reim['reimburseType']['gradeReimburseTypes']['plafon'];
        @endphp
        <tr>
            @if ($key == 0)
            <td rowspan="{{$item['form_count']}}">{{ $key + 1 }}</td>
            <td rowspan="{{$item['form_count']}}">{{ $item['code'] }}</td>
            <td rowspan="{{$item['form_count']}}">{{ $item['employee_no'] }}</td>
            <td rowspan="{{$item['form_count']}}">{{ $item['employee_name'] }}</td>
            @endif
            <td>{{ $reim['reimburseType']['name'] }}</td>
            <td>{{ $item['request_date'] }}</td>
            <td>{{ $item['claim'] }}</td>
            <td>{{ $item['claim'] }}</td>
            <td>{{ $item['curency'] }}</td>
            <td>{{ number_format($reim['balance'], 0, ',', '.') }}</td>
            <td>{{ number_format($reim['balance'], 0, ',', '.') }}</td>
            <td>{{ $item['type_of_expense'] }}</td>
            <td>{{ $item['remark'] }}</td>
            <td>{{ $item['additional_field'] }}</td>
            <td>{{ $item['status'] }}</td>
            <td>{{ $statusPaid }}</td>
            <td>{{ $statusPaid == 'Paid' ? $item['claim'] : "" }}</td>
            <td>{{ $item['source'] }}</td>
            <td>{{ $item['cancels'] }}</td>
            <td>{{ $item['status'] }}</td>
            <td>{{ number_format($totalBalance, 0, ',', '.') }}</td>
            <td>{{ number_format(($totalBalance - $data->sum('balance')), 0, ',', '.') }}</td>
        </tr>
        @endforeach
        @endforeach
        <tr>
            <td colspan="8">Grand Total</td>
            <td></td>
            <td>{{ number_format($data->sum('balance'), 0, ',', '.') }}</td>
            <td>{{ number_format($data->sum('balance'), 0, ',', '.') }}</td>
            <td colspan="9"></td>
        </tr>
    </tbody>
</table>
