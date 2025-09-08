@inject('carbon', 'Carbon\Carbon')
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance Onduty Request</title>
    <style>
        * {
            box-sizing: border-box
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        .container {
            width: 100%;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        h2 {
            text-align: center;
        }

        .status-approved {
            color: green;
            font-weight: bold;
        }

        .info-table {
            margin-bottom: 20px;
            border-collapse: collapse;
        }

        .info-table td {
            padding: 5px;
        }
        .info-table tr {
            border-bottom: 1px solid #656565;
        }

        .info-table td:first-child { background-color:#eaeaea }

        .detail-table, .value-table {
            margin-top: 10px;
            border-collapse: collapse;
            text-align: left;
        }

        .detail-table th, .detail-table td,
        .value-table th, .value-table td {
            border: 1px solid #ddd;
            padding: 5px;
        }

        .value-table caption {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .tables-wrapper {
            display: flex;
            gap: 20px;
        }

        .value-table td:nth-child(1),
        .value-table th:nth-child(1) {
            width: 50%;
        }

        .value-table th {
            background-color: #f2f2f2;
        }

        .total-row {
            font-weight: bold;
        }

        .tabs {
            display: flex;
            margin-top: 20px;
        }

        .tab-button {
            padding: 10px 20px;
            cursor: pointer;
            background-color: #f1f1f1;
            border: 1px solid #ddd;
            border-bottom: none;
        }

        .tab-button.active {
            background-color: #ffffff;
            border-top: 2px solid #333;
        }

        .tab-content {
            display: none;
            border: 1px solid #ddd;
            padding: 10px;
            background-color: #ffffff;
        }

        .tab-content.active {
            display: block;
        }

        .approval table {
            width: 100%;
            margin-top: 2rem;
        }

        .approval table tbody tr td {
            font-weight: normal;
            padding: 2px;
        }

        .button-container {
            text-align: center;
        }

        .waiting-approve {
            background-color: #fef6e0; /* Light background */
            color: #b57c00; /* Darker text color */
            border: 2px solid #b57c00; /* Border color */
            border-radius: 25px; /* Rounded corners */
            padding: 8px 17px; /* Padding */
            font-size: 0.875rem;
            line-height: 1.25rem;
            cursor: pointer; /* Pointer cursor */
            display: flex;
            align-items: center;
            cursor: default;
        }
        .icon {
            margin-right: 8px; /* Space between icon and text */
        }

        .waiting{
            background-color: #f4e5bd; /* Light background */
            color: rgb(202 138 4); /* Darker text color */
            border: 2px solid rgb(202 138 4 ); /* Border color */
        }
        .approve{
            background-color: #dcffd8; /* Light background */
            color: rgb(22 163 74); /* Darker text color */
            border: 2px solid rgb(22 163 74); /* Border color */
        }
        .reject{
            background-color: #fef6e0; /* Light background */
            color: red; /* Darker text color */
            border: 2px solid #ff4e4e; /* Border color */
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Attendance Onduty Request</h2>
    <p><strong>Request No.:</strong> {{$data['request_no']}}</p>
    <p><strong>Company:</strong> PT. Mitsubishi Electric Indonesia</p>
    <p><strong>Request for:</strong> {{$data['request_for']}}</p>
    <p><strong>Requested By:</strong> {{$data['requested_by']}}</p>
    <div style="display: flex; align-items: center;gap: 10px;margin-bottom:1rem;">
        <strong>Status:</strong>
        @if ($data['status']['code'] == 'waiting_approve')
            @php
                $color = 'waiting';
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>';
            @endphp
        @elseif ($data['status']['code'] == 'fully_approve')
            @php
                $color = 'approve';
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>';
            @endphp
        @elseif ($data['status']['code'] == 'reject_to')
            @php
                $color = 'reject';
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban"><circle cx="12" cy="12" r="10"></circle><path d="m4.9 4.9 14.2 14.2"></path></svg>';
            @endphp
        @elseif ($data['status']['code'] == 'cancel')
            @php
                $color = 'waiting';
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>';
            @endphp
        @elseif ($data['status']['code'] == 'approve_to')
            @php
                $color = 'waiting';
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>';
            @endphp
        @elseif ($data['status']['code'] == 'revise')
            @php
                $color = 'reject';
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban"><circle cx="12" cy="12" r="10"></circle><path d="m4.9 4.9 14.2 14.2"></path></svg>';
            @endphp
        @endif
        <button class="waiting-approve {{$color}}">
            <span class="icon">
                {!!$icon!!}
            </span> {{$data['status']['name']}}
        </button>
    </div>

    <table class="info-table">
        <tr>
            <td><strong>Purpose Type</strong></td>
            <td>{{$data['purpose_type_name']}}</td>
        </tr>
        <tr>
            <td><strong>Pusat Biaya</strong></td>
            <td>{{$data['cost_center']}}</td>
        </tr>
        <tr>
            <td><strong>Start Date</strong></td>
            <td>{{$data['start_date']}}</td>
        </tr>
        <tr>
            <td><strong>End Date</strong></td>
            <td>{{$data['end_date']}}</td>
        </tr>
        <tr>
            <td><strong>Remark</strong></td>
            <td>{{$data['remarks']}}</td>
        </tr>
        <tr>
            <td><strong>Attachment File</strong></td>
            <td style="display: flex;flex-direction: column;">
                @foreach ($data['file_attachement'] as $item)
                <a href="{{$item['url']}}" target='_blank' style="color: blue;padding-bottom: 5px;" rel='noopener noreferrer'>
                    {{$item['file_name']}}
                  </a>
                @endforeach
            </td>
        </tr>
        @if ($data['cash_advance'] == 1)
        <tr>
            <td><strong>Ref Number</strong></td>
            <td>{{$data['reference_number']}}</td>
        </tr>
        <tr>
            <td><strong>Total Percent</strong></td>
            <td>{{$data['total_percent']}}%</td>
        </tr>
        <tr>
            <td><strong>Total Cash Advance</strong></td>
            <td>{{$data['total_cash_advance']}}</td>
        </tr>
        @endif
    </table>

    <div class="tabs">
        {{-- LOOPING DESTINASI --}}
        @foreach ($data['business_trip_destination'] as $key => $item)
            <button class="tab-button {{$key == 0 ? 'active' : ''}}" onclick="openTab(event, '{{$item['destination'].'-'.$item['id']}}')">{{$item['destination']}}</button>
        @endforeach
    </div>

    @foreach ($data['business_trip_destination'] as $idx => $row)
        <div id="{{$row['destination'].'-'.$row['id']}}" class="tab-content {{$idx == 0 ? 'active' : ''}}">
            <div style="">
                <h3>Detail {{$row['destination']}}</h3>
                @if ($row['restricted_area'] === 1)
                    <div style="background-color: #fd0000; display: inline-block; color: white; margin: 0.3rem 0; padding: 0.5rem 1rem; border-radius: 0.375rem;">
                        <span style="font-size: 0.75rem;">Restricted Area</span>
                    </div>
                @endif
            </div>
            <table class="detail-table">
                <tr>
                    <th>Date</th>
                    <th>Shift</th>
                    <th>Shift Start</th>
                    <th>Shift End</th>
                    <th>Actual Start</th>
                    <th>Actual End</th>
                </tr>
                @foreach ($row['business_trip_detail_attendance'] as $detail)
                    <tr>
                        <td>{{date('d/m/Y',strtotime($detail['date']))}}</td>
                        <td>{{$detail['shift_code']}}</td>
                        <td>{{$detail['shift_start']}}</td>
                        <td>{{$detail['shift_end']}}</td>
                        <td>
                            {{date('d/m/Y',strtotime($detail['start_date']))}} {{$detail['start_time']}}
                        </td>
                        <td>
                            {{date('d/m/Y',strtotime($detail['end_date']))}} {{$detail['end_time']}}
                        </td>
                    </tr>
                @endforeach
            </table>
            <div class="tables-wrapper">
                <table class="value-table">
                    <caption>Standard Value</caption>
                    <tr>
                        <th>Item Name</th>
                        <th>Currency Code</th>
                        <th>Value</th>
                        <th>Total Days</th>
                        <th>Total</th>
                    </tr>
                    @php
                        $total_standar_value = 0;
                    @endphp
                    @foreach ($row['standar_detail_allowance'] as $standar)
                        <tr>
                            <td>{{ $standar['item_name']  ?? ''}} ({{ $standar['type'] ?? '' }})</td>
                            <td>{{ $standar['currency_code'] ?? '' }}</td>
                            <td>{{ number_format($standar['value'],0,',','.') }}</td>
                            <td>{{ $standar['total_day'] }}</td>
                            <td>{{ number_format($standar['total'],0,',','.') }}</td>
                        </tr>
                        @php
                            $total_standar_value += $standar['total'];
                        @endphp
                    @endforeach
                    <tr>
                        <td><strong>Total Standar Value</strong></td>
                        <td>IDR</td>
                        <td></td>
                        <td></td>
                        <td>{{number_format($total_standar_value,0,',','.')}}</td>
                    </tr>
                </table>

                <table class="value-table">
                    <caption>Requested Value</caption>
                    <tr>
                        <th>Item Name</th>
                        <th>Currency Code</th>
                        <th>Value</th>
                        <th>Total Days</th>
                        <th>Total</th>
                    </tr>
                    @php
                        $total_request_value = 0;
                    @endphp
                    @foreach ($row['request_detail_allowance'] as $request)
                        <tr>
                            <td>{{ $request['item_name']  ?? ''}} ({{ $request['type'] ?? '' }})</td>
                            <td>{{ $request['currency_code'] ?? '' }}</td>
                            <td>{{ number_format($request['value'],0,',','.') }}</td>
                            <td>{{ $request['total_day'] }}</td>
                            <td>{{ number_format($request['total'],0,',','.') }}</td>
                        </tr>
                        @php
                            $total_request_value += $request['total'];
                        @endphp
                    @endforeach
                    <tr>
                        <td><strong>Total Request Value</strong></td>
                        <td>IDR</td>
                        <td></td>
                        <td></td>
                        <td>{{number_format($total_request_value,0,',','.')}}</td>
                    </tr>
                </table>
            </div>
        </div>
    @endforeach

    <div class="approval">
        <table>
            <thead>
                <tr>
                    <td>Approver</td>
                    <td>Position</td>
                    <td>Decision</td>
                    <td>Date</td>
                </tr>
            </thead>
            <tbody>
                @foreach ($data['approval'] as $item)
                    <tr>
                        <td>{{$item['user']['name']}}</td>
                        <td>{{isset($item['user']['division']) ? $item['user']['division']['name'] : '-'}}</td>
                        <td>{{$item['status']}}</td>
                        <td>{{$item['is_status'] ? $carbon::parse($item['updated_at'])->format('d M Y (H:i)') : '-'}}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

<script>
    function openTab(event, tabName) {
        console.log(tabName)
        // Hide all tab contents
        let tabContents = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = "none";
            tabContents[i].classList.remove("active");
        }

        // Remove the "active" class from all buttons
        let tabButtons = document.getElementsByClassName("tab-button");
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove("active");
        }

        // Show the current tab, and add an "active" class to the button that opened it
        document.getElementById(tabName).style.display = "block";
        document.getElementById(tabName).classList.add("active");
        event.currentTarget.classList.add("active");
    }

    // Default open first tab on page load
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelector(".tab-button").click();
    });
</script>
</body>
</html>
