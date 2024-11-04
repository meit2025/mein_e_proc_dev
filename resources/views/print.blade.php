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
    </style>
</head>
<body>

<div class="container">
    <h2>Attendance Onduty Request</h2>
    <p><strong>Request No.:</strong> {{$data->request_no}}</p>
    <p><strong>Company:</strong> PT. Mitsubishi Electric Indonesia</p>
    <p><strong>Request for:</strong> {{$data->requestFor->name}}</p>
    <p><strong>Requested By:</strong> {{$data->requestedBy->name}}</p>
    <p><strong>Status:</strong> <span class="status-approved">Fully Approved</span></p>

    <table class="info-table">
        <tr>
            <td><strong>Purpose Type</strong></td>
            <td>{{$data->purposeType->name ?? ''}}</td>
        </tr>
        <tr>
            <td><strong>Pusat Biaya</strong></td>
            <td>{{$data->costCenter->cost_center ?? ''}}</td>
        </tr>
        <tr>
            <td><strong>Start Date</strong></td>
            <td>17 Aug 2023</td>
        </tr>
        <tr>
            <td><strong>End Date</strong></td>
            <td>17 Aug 2023</td>
        </tr>
        <tr>
            <td><strong>Remark</strong></td>
            <td>{{$data->remarks}}</td>
        </tr>
        <tr>
            <td><strong>Attachment File</strong></td>
            <td></td>
        </tr>
    </table>

    <div class="tabs">
        {{-- LOOPING DESTINASI --}}
        @foreach ($data->businessTripDestination as $key => $item)
            <button class="tab-button {{$key == 0 ? 'active' : ''}}" onclick="openTab(event, '{{$item->destination}}')">{{$item->destination}}</button>
        @endforeach
    </div>

    @foreach ($data->businessTripDestination as $idx => $row)
        <div id="{{$row->destination}}" class="tab-content {{$key == 0 ? 'active' : ''}}">
            <h3>Detail {{$row->destination}}</h3>
            <table class="detail-table">
                <tr>
                    <th>Date</th>
                    <th>Shift</th>
                    <th>Shift Start</th>
                    <th>Shift End</th>
                    <th>Actual Start</th>
                    <th>Actual End</th>
                </tr>
                @foreach ($row->detailAttendance as $detail)
                    <tr>
                        <td>{{date('d/m/Y',strtotime($detail->date))}}</td>
                        <td>{{$detail->shift_code}}</td>
                        <td>{{$detail->shift_start}}</td>
                        <td>{{$detail->shift_end}}</td>
                        <td>{{$detail->start_time}}</td>
                        <td>{{$detail->end_time}}</td>
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
                    dd($row->groupDestination);
                        // Group items by allowance_item_id
                        $groupedItems = $row->detailDestinationDay->groupBy('allowance_item_id');
                        $total_standar = 0;
                    @endphp

                    @foreach ($groupedItems as $allowanceItemId => $items)
                    @dd($items)
                        @php
                            // Get the first item in the group for displaying allowance details
                            $firstItem = $items->first();
                            $totalCount = $items->count(); // Count of items in this group
                            $totalPrice = $items->sum('price'); // Sum of prices in this group
                        @endphp
                        <tr>
                            <td>{{ $firstItem->allowance->name  ?? ''}} ({{ $firstItem->allowance->type ?? '' }})</td>
                            <td>{{ $firstItem->allowance->currency_id ?? '' }}</td>
                            <td>{{ $firstItem->allowance->grade_price ?? '' }}</td>
                            <td>{{ $totalCount }}</td>
                            <td>{{ ($firstItem->allowance->grade_price ?? 0) * $totalCount }}</td>
                        </tr>
                        @php
                            $total_standar += ($firstItem->allowance->grade_price ?? 0 )* $totalCount;
                        @endphp
                    @endforeach

                    @php
                        // Group items by allowance_item_id
                        $groupedItemsTotal = $row->detailDestinationTotal->groupBy('allowance_item_id');
                    @endphp

                    @foreach ($groupedItemsTotal as $allowanceItemId => $items)
                        @php
                            // Get the first item in the group for displaying allowance details
                            $firstItem = $items->first();
                            $totalCount = $items->count(); // Count of items in this group
                            $totalPrice = $items->sum('price'); // Sum of prices in this group
                        @endphp
                        <tr>
                            <td>{{ $firstItem->allowance->name }} ({{ $firstItem->allowance->type }})</td>
                            <td>{{ $firstItem->allowance->currency_id }}</td>
                            <td>{{ $firstItem->allowance->grade_price }}</td>
                            <td>{{ $totalCount }}</td>
                            <td>{{ $firstItem->allowance->grade_price * $totalCount }}</td>
                        </tr>
                        @php
                            $total_standar += $firstItem->allowance->grade_price * $totalCount;
                        @endphp
                    @endforeach
                    <tr>
                        <td><strong>Total Standar Value</strong></td>
                        <td>IDR</td>
                        <td></td>
                        <td></td>
                        <td>{{$total_standar}}</td>
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
                        // Group items by allowance_item_id
                        $groupedItems = $row->detailDestinationDay->groupBy('allowance_item_id');
                        $total_request = 0;
                    @endphp

                    @foreach ($groupedItems as $allowanceItemId => $items)
                        @php
                            // Get the first item in the group for displaying allowance details
                            $firstItem = $items->first();
                            $totalCount = $items->count(); // Count of items in this group
                            $totalPrice = $items->sum('price'); // Sum of prices in this group
                        @endphp
                        <tr>
                            <td>{{ $firstItem->allowance->name }} ({{ $firstItem->allowance->type }})</td>
                            <td>{{ $firstItem->allowance->currency_id }}</td>
                            <td>{{ $firstItem->price }}</td>
                            <td>{{ $totalCount }}</td>
                            <td>{{ $totalPrice }}</td>
                        </tr>
                        @php
                            $total_request += $totalPrice;
                        @endphp
                    @endforeach

                    @php
                        // Group items by allowance_item_id
                        $groupedItemsTotal = $row->detailDestinationTotal->groupBy('allowance_item_id');
                    @endphp

                    @foreach ($groupedItemsTotal as $allowanceItemId => $items)
                        @php
                            // Get the first item in the group for displaying allowance details
                            $firstItem = $items->first();
                            $totalCount = $items->count(); // Count of items in this group
                            $totalPrice = $items->sum('price'); // Sum of prices in this group
                        @endphp
                        <tr>
                            <td>{{ $firstItem->allowance->name }} ({{ $firstItem->allowance->type }})</td>
                            <td>{{ $firstItem->allowance->currency_id }}</td>
                            <td>{{ $firstItem->allowance->grade_price }}</td>
                            <td>{{ $totalCount }}</td>
                            <td>{{ $firstItem->allowance->grade_price * $totalCount }}</td>
                        </tr>
                        @php
                            $total_request += $firstItem->allowance->grade_price * $totalCount;
                        @endphp
                    @endforeach
                    <tr>
                        <td><strong>Total Request Value</strong></td>
                        <td>IDR</td>
                        <td></td>
                        <td></td>
                        <td>{{$total_request}}</td>
                    </tr>
                </table>
            </div>
        </div>
    @endforeach
</div>

<script>
    function openTab(event, tabName) {
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
