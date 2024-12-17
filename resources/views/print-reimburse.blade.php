@inject('carbon', 'Carbon\Carbon')

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="{{asset('images/mitsubishi_icon.png')}}" rel="apple-touch-icon" sizes="180x180"/>
    <link href="{{asset('images/mitsubishi_icon.png')}}" rel="icon" sizes="32x32" type="image/png"/>
    <link href="{{asset('images/mitsubishi_icon.png')}}" rel="icon" sizes="32x32" type="image/png"/>
    <link href="{{asset('images/mitsubishi_icon.png')}}" rel="icon" sizes="16x16" type="image/png"/>
    <link href="{{asset('images/mitsubishi_icon.png')}}" rel="icon" sizes="16x16" type="image/png"/>
    <link href="{{asset('images/mitsubishi_icon.png')}}" rel="shortcut icon"/>
    <title>Reimbursement Request</title>
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

        .status-approved {
            color: green;
            font-weight: bold;
        }

        .info {
            margin: 2rem 0;
        }

        .info-table {
            border-collapse: collapse;
        }

        .info-table td {
            padding: 5px;
        }
        .info-table tr {
            border-bottom: 1px solid #656565;
        }

        .info-table td:first-child { background-color:#eaeaea }

        .detail-table {
            margin-top: 10px;
            border-collapse: collapse;
            text-align: left;
        }

        .detail-table th, .detail-table td {
            border: 1px solid #ddd;
            padding: 5px;
        }

        .tables-wrapper {
            display: flex;
            gap: 20px;
        }

        .approval table {
            width: 100%;
        }

        .approval table tbody tr td {
            font-weight: normal;
        }

        .text-orange-600{
            color: rgb(234 88 12);
        }
        
        .text-red-600{
            color: rgb(220 38 38);
        }

        .text-green-600{
            color: rgb(22 163 74);
        }

    </style>
</head>
<body>

<div class="container">
    <h2>Reimbursement Request</h2>
    <p><strong>Request No.:</strong> {{$data['group']['code']}}</p>
    <p><strong>Company:</strong> PT. Mitsubishi Electric Indonesia</p>
    <p><strong>Request For:</strong> {{$data['group']['user']['name']}}</p>
    <p><strong>Requested By:</strong> {{$data['group']['userCreateRequest']['name']}}</p>
    <p><strong>Status: <span class='{{$data['group']['reimbursementStatus']['classname']}}'>{{$data['group']['reimbursementStatus']['name']}}</span></strong></p>

    @php
        // dd($data);
        $index = 0;
    @endphp
    @foreach ($data['forms'] as $formItems)
        @php
            $index++;
        @endphp
        <div class="info">
            <p>Form {{ $index }}</p>
            <table class="info-table">
                <tr>
                    <td><strong>Type Of Reimbursement</strong></td>
                    <td>{{$formItems['reimburseType']['name']}}</td>
                </tr>
                <tr>
                    <td><strong>Reimbursement Balance Date</strong></td>
                    <td>{{$carbon::parse($formItems['reimburseType']['created_at'])->format('d/m/Y')}}</td>
                </tr>
                <tr>
                    <td><strong>Balance Period</strong></td>
                    <td>{{$carbon::parse($formItems['periodeDate']['start'])->format('d/m/Y')}} - {{$carbon::parse($formItems['periodeDate']['end'])->format('d/m/Y')}}</td>
                </tr>
                <tr>
                    <td><strong>Reimburse For</strong></td>
                    <td>{{$formItems['reimburseType']['is_employee'] ? 'Employee' : 'Family' }}</td>
                </tr>
                @if (!$formItems['reimburseType']['is_employee'])
                    @php
                        $familiesArray = $data['group']['user']['families']->toArray();
                        $getFamilies = array_filter($familiesArray, function($family) use ($formItems) {
                            return $family['id'] == $formItems['for'];
                        });
                        
                        $getFamily = reset($getFamilies);
                    @endphp
                    <tr>
                        <td><strong>Family Status</strong></td>
                        <td>{{$formItems['reimburseType']['family_status']}}</td>
                    </tr>
                    <tr>
                        <td><strong>Family</strong></td>
                        <td>{{$getFamily['name']}}</td>
                    </tr>
                @endif
                <tr>
                    <td><strong>Pusat Biaya</strong></td>
                    <td>{{$data['group']['costCenter']['desc']}}</td>
                </tr>
                <tr>
                    <td><strong>Balance</strong></td>
                    <td>Rp {{ number_format($formItems['reimburseType']['grade_option'] == 'all' ? $formItems['reimburseType']['grade_all_price'] : $formItems['reimburseType']['gradeReimburseTypes']['plafon'], 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td><strong>Receipt Date</strong></td>
                    <td>{{$carbon::parse($formItems['item_delivery_data'])->format('d/m/Y')}}</td>
                </tr>
                <tr>
                    <td><strong>Request Date</strong></td>
                    <td>{{$carbon::parse($formItems['created_at'])->format('d/m/Y')}}</td>
                </tr>
                <tr>
                    <td><strong>Start Date -  End Date</strong></td>
                    <td>{{$carbon::parse($formItems['start_date'])->format('d/m/Y')}} - {{$carbon::parse($formItems['end_date'])->format('d/m/Y')}}</td>
                </tr>
                <tr>
                    <td><strong>Reimburse Cost</strong></td>
                    <td>Rp {{ number_format($formItems['balance'], 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td><strong>Valid Cost</strong></td>
                    <td>Rp {{ number_format($formItems['balance'], 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td><strong>Approved Cost</strong></td>
                    <td>Rp {{ number_format($formItems['balance'], 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td><strong>Remark</strong></td>
                    <td>{{$formItems['short_text']}}</td>
                </tr>
                <tr>
                    <td><strong>File Attachment</strong></td>
                    <td>{{$formItems['reimburseType']['name']}}</td>
                </tr>
            </table>
        </div>
    @endforeach
    {{-- @php
        dd($data);
    @endphp --}}
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
                        <td>{{$carbon::parse($formItems['updated_at'])->format('d M Y (H:i)')}}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
</body>
</html>
