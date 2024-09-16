<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    //

    public function login()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('Auth/login');
    }

    public function store(LoginRequest $request)
    {
        $data = User::orWhere('email', $request->email)->first();
        if (!$data) {
            return $this->errorResponse('Email not found', 400, [
                'email' => ['The provided email does not match our records.']
            ]);
        }

        $data = [
            'email'     => $data->email,
            'password'  => $request->input('password'),
        ];

        if (Auth::attempt($data)) {
            return $this->successResponse($data);
        } else {
            return $this->errorResponse('Password incorrect', 400, [
                'password' => ['The provided password is incorrect.']
            ]);
        }
    }
}
