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
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
        }

        th {
            background-color: #4CAF50;
            color: white;
        }

        td {
            background-color: #f2f2f2;
        }

        .link {
            color: blue;
            text-decoration: none;
        }
    </style>
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
                    <br>
                    There are some Request waiting for your approval. Kindly find the details below :
                    <br>
                <table>
                    <thead>
                        <tr>
                            <th>Request Number</th>
                            <th>Requester</th>
                            <th>Type</th>
                            <th>Link</th>
                        </tr>
                    </thead>

                    <tbody>
                        @foreach ($type as $item)
                        <tr>
                            <td>{{$item['pr']}}</td>
                            <td>{{$item['name']}}</td>
                            <td>{{$item['type']}}</td>
                            <td><a href="{{$item['url']}}" class="link">Link</a></td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
                <br>

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
