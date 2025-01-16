<?php

namespace App\Http\Controllers;

use App\Mail\TestEmail;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class NotifikasiController extends Controller
{
    //
    public function index()
    {
        $user = Auth::user();
        $notifications = Notifikasi::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return $this->successResponse($notifications);
    }

    public function read()
    {
        $user = Auth::user();

        $notifications = Notifikasi::where('user_id', $user->id)->update([
            'is_read' => true,
        ]);

        return $this->successResponse($notifications);
    }

    public function destory()
    {
        $user = Auth::user();
        $notifications = Notifikasi::where('user_id', $user->id)->delete();
        return $this->successResponse($notifications);
    }

    public function sendTestEmail(Request $request)
    {
        // Mail::to($request->email)->send(new TestEmail());

        ini_set("SMTP", "10.236.112.162"); // Ganti dengan server SMTP Anda
        ini_set("smtp_port", "25");         // Ganti dengan port SMTP Anda
        ini_set("sendmail_path", "/usr/sbin/sendmail -t -i"); // Path sendmail jika diperlukan

        $message = "
        <html>
        <head>
        <title>Test Email</title>
        </head>
        <body>
        <h1>Hello!</h1>
        <p>This is a test email sent from PHP.</p>
        </body>
        </html>
        ";

        // Header email
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

        // Tambahkan informasi pengirim
        $headers .= "From: mein-it-support_dl@asia.meap.com" . "\r\n";

        // Kirim email
        if (mail('mein-it-support_dl@asia.meap.com', "test", $message, $headers)) {
            echo "Email berhasil dikirim.";
        } else {
            echo "Gagal mengirim email.";
        }

        return $this->successResponse('Email sent');
    }
}
