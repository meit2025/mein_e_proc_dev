<?php

namespace App\Http\Controllers;

use App\Mail\TestEmail;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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
        $mail = new PHPMailer(true);

        try {
            // Pengaturan server SMTP
            $mail->isSMTP();
            $mail->Host = '10.236.112.162'; // Alamat server SMTP Anda
            $mail->SMTPAuth = false; // Jika server SMTP memerlukan otentikasi
            $mail->Username = null; // Ganti dengan username SMTP Anda
            $mail->Password = null; // Ganti dengan password SMTP Anda
            $mail->Port = 25; // Port SMTP

            // Pengaturan email
            $mail->setFrom('mein-it-support_dl@asia.meap.com', 'IT Support'); // Alamat pengirim
            $mail->addAddress('mein-it-support_dl@asia.meap.com'); // Alamat penerima
            $mail->Subject = 'Test Email';
            $mail->Body = '<p>This is a test email sent via PHPMailer.</p>';
            $mail->isHTML(true); // Kirim email dalam format HTML

            // Kirim email
            $mail->send();
            echo 'Email berhasil dikirim.';
        } catch (Exception $e) {
            echo "Gagal mengirim email. Error: {$mail->ErrorInfo} {$e->getMessage()}";
        }

        return $this->successResponse('Email sent');
    }
}
