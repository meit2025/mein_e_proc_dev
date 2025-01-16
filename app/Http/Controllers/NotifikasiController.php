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
        Mail::to($request->email)->send(new TestEmail());

        return $this->successResponse('Email sent');
    }
}
