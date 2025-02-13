<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700,800,900&display=swap" rel="stylesheet">
    <link
        href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
        integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
</head>

<body style="font-family: Nunito, sans-serif;">
    <div style=" width: 100%; height: 200px; border-radius: 0 0 100% 100%; background-color: #D6D6D6;">
        <div
            style="display:-webkit-flex; flex-direction: row; align-items: center; justify-content: center;text-align:center;">
            <div style="margin:auto; padding-top:50px">
                <img style="width:200px;height:80px;margin-right:20px" src="{{public_path('images/icon.png')}}" alt="
                    Icon" />
            </div>
        </div>
    </div>
    <div style="padding: 0px 10px 0px 10px">
        <div style="display: flex;justify-content: center;">
            <div
                style="width:100%;border: 2px solid #D7E1EA; border-radius:10px; padding:10px 30px 10px 30px; margin-top:20px">
                <br>

                <p>
                    Dear, <span class="font-weight-bold" style="font-weight: bold;">{{$user->name}}</span>

                    {{-- body --}}
                    @if($type == 'Purchase Requisition')
                    <br>
                    We would like to inform you that your Purchase Requisition (PR) request has been processed. Below
                    are the details:
                    <br>
                    Status: {{ $status }}
                    <br>
                    Please review the details accordingly. If any action is required, kindly proceed as necessary.
                    <br>
                    PR Number : {{$pr}}
                    <br>
                    Requester : {{$purchase->user->name}}
                    <br>
                    Proposed Vendor: {{
                    $purchase->vendorsWinner->masterBusinesPartnerss->name_one
                    }}
                    <br>
                    Quotation Number: {{$purchase->vendorsWinner->quotation}}
                    <br>
                    Item Details:
                    <hr>
                    @foreach ($purchase->vendorsWinner->units as $item)
                    Material Number: {{ $item->material_number }}
                    <br>
                    Quantity (QTY): {{ $item->qty }}
                    <br>
                    Unit Price: {{ $item->unit_price }}
                    <br>
                    Total Amount: {{ $item->total_amount }}
                    <br>
                    Remark: {{ $item->short_text }}
                    <hr>
                    @endforeach

                    <br>
                    <br>
                    Kindly review and provide your approval decision through the system
                <p style="font-weight: 700;font-family: 'Rubik', sans-serif;font-size: 20px">
                    <a href="{{$url}}"> View Detail </a>
                </p>
                @endif
                {{-- end body --}}

                @if ($type == 'Reimbursement')
                    <br><br>
                        @if ($status == 'Approved')
                            There are some Request Fully Approved. Kindly find the details below :
                        @elseif ($status == 'Rejected')
                            We regret to inform you that your reimbursement request has been rejected. Below are the details:
                        @elseif ($status == 'Revise')
                            Your reimbursement request requires revision. Below are the details:
                        @elseif ($status == 'Approver')
                            You have a pending approval request for the Reimbursement. Below are the details:
                        @endif
                        <br><br>

                        Reimbursement Number: {{$reimburseGroup->code}}
                        <br>
                        Requester: {{$user->name}}
                        <br>
                        Reimbursement Details:
                        <br><br>

                        @foreach ($reimburseGroup->reimburses as $key  => $item)
                        Form {{$key + 1}} :
                        <ul>
                            <li>
                                Reimbursement Type: {{$item->reimburseType->name}}
                            </li>
                            <li>
                                Claim Date: {{ date('F j, Y', strtotime($item->claim_date)) }}
                            </li>
                            <li>
                                Reimbursement Cost: Rp. {{ number_format($item->balance, 0, ',', '.') }}
                            </li>
                        </ul>
                        @endforeach
                        
                        @if ($status == 'Approved')
                            Approve : {{ $reimburseGroup->notes }}
                        @elseif ($status == 'Rejected')
                            Rejection : {{ $reimburseGroup->notes }}
                        @elseif ($status == 'Revise')
                            Revision : {{ $reimburseGroup->notes }}
                        @endif 
                        <br>
                        @if ($status == 'Rejected')
                            Please review the request and make necessary adjustments if required.
                        @elseif ($status == 'Revise')
                            Please review then resubmit the request and make necessary adjustments if required.
                        @elseif ($status == 'Approver')
                            Please review then resubmit the request and make necessary adjustments if required.
                        @endif
                        <br>
                        <a href="{{$url}}" target="_blank" style="font-weight: bolder;">{{$status == 'Approver' ? 'Approve Now' : 'View Detail'}}</a>
                    <br>
                @endif

                @if ($type == 'Business Trip')
                <br>
                We would like to inform you that your Business Trip request has been processed. Below
                are the details:
                <br>
                Status: {{ $status }}
                @endif
                </p>

                <div>
                    <p style="font-weight: 500; font-size: 14px; color: #1f1f1f;">Thank you,
                        <br>
                        Best regards,
                        <br> MEIN Information System Portal
                    </p>
                </div>
                <div style="background-color: #D7E1EA;height:2px"></div>
                <div style="display:flex;margin-top:20px">
                    <div>
                        <div style="display: flex">
                            <img style="width:200px;height:80px;margin-right:20px;margin-top: 20px"
                                src="{{public_path('images/icon.png')}}" alt=" Icon">
                        </div>

                    </div>

                    <div style="margin-left: 20px">
                        <div style="margin-top: 5px">
                            <b style="font-weight: 700;font-size: 20px;color: #1f1f1f;"><strong> PT Mitsubishi Electric
                                    Indonesia</strong></b>
                        </div>
                        <div style="margin-top: 5px">
                            <b style="  font-size: 16px;margin-top:10px;
		font-weight: 500;
		color: #6C6C6C">Gedung Jaya 8th Floor, Jl MH.Thamrin No 12 Jakarta Pusat 10340 Indonesia</b>
                        </div>
                        <div>
                            <b style="  font-size: 16px;margin-top:10px;
		font-weight: 500;
		color: #6C6C6C">+62-21-31926461</b>
                        </div>
                        <div>
                            <b style="  font-size: 16px;margin-top:10px;
		font-weight: 500;
		color: #6C6C6C">marcomm.mein@asia.meap.com</b>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
