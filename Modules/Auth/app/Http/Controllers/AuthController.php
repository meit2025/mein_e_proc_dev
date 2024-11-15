<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Services\LdapAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        $fileImage = asset('images/mitsubishi_logo.png');
        $bgImage = asset('images/login_bg.png');

        return Inertia::render('Auth/Login', [
            'fileImage'  => $fileImage,
            'bgImage' => $bgImage
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('auth::create');
    }

    /**
     * Store a newly created resource in storage.
     */

    // public function store(LdapAuthService $ldapService, LoginRequest $request)
    // {
    //     // JIKA ADA KONEKSI KE LDAP
    //     if (env("APP_ENV") != 'local') {
    //         try {

    //             $ldapConnect = $ldapService->connect();
    //             if ($ldapConnect) {
    //                 // LOGIN KE LDAP
    //                 //code...
    //                 $ldapUser = $ldapService->login($ldapConnect, $request->username, $request->password);
    //                 if ($ldapUser) {
    //                     $user = User::orWhere('username', $request->username)->first();
    //                     if (is_null($user)) {
    //                         $user = User::create([
    //                             'email'     => $request->username,
    //                             'password'  => Hash::make($request->password),
    //                             'name' => $request->username,
    //                             'nip'  =>  $request->username . '12345',
    //                             'division' =>  'IT',
    //                             'role' =>  'user',
    //                             'job_level' =>  'staff',
    //                             'immediate_spv'     =>  '23456',
    //                             'name'              =>  'Doe',
    //                             'email'             =>  $request->username . '@gmail.com',
    //                             'username' => $request->username,
    //                         ]);
    //                     }
    //                     Auth::login($user);
    //                     $data = [
    //                         'username'     => $request->username,
    //                         'password'  => $request->password,
    //                     ];
    //                     return $this->successResponse($data);
    //                 }
    //             }
    //         } catch (\Throwable $th) {
    //             $data = User::where('username', $request->username)->first();
    //             if (!$data) {
    //                 return $this->errorResponse('username not found', 400, [
    //                     'username' => ['The provided email does not match our records.']
    //                 ]);
    //             }

    //             $data = [
    //                 'username'     => $request->username,
    //                 'password'  => $request->password,
    //             ];


    //             if (Auth::attempt($data)) {
    //                 return $this->successResponse($data);
    //             } else {
    //                 return $this->errorResponse('Password incorrect', 400, [
    //                     'password' => ['The provided password is incorrect.']
    //                 ]);
    //             }
    //         }
    //     }

    //     $data = User::where('username', $request->username)->first();
    //     if (!$data) {
    //         return $this->errorResponse('username not found', 400, [
    //             'username' => ['The provided email does not match our records.']
    //         ]);
    //     }

    //     $data = [
    //         'username'    => $request->username,
    //         'password'  => $request->password,
    //     ];




    //     if (Auth::attempt($data)) {
    //         return $this->successResponse($data);
    //     } else {
    //         return $this->errorResponse('Password incorrect', 400, [
    //             'password' => ['The provided password is incorrect.']
    //         ]);
    //     }
    // }

    public function store(LdapAuthService $ldapService, LoginRequest $request)
    {
        $remember = $request->filled('remember_me');
        $credentials = ['username' => $request->username, 'password' => $request->password];

        // If the environment is not local, attempt LDAP login
        if (env("APP_ENV") !== 'local') {
            try {
                $ldapConnect = $ldapService->connect();

                if ($ldapConnect && ($ldapUser = $ldapService->login($ldapConnect, $request->username, $request->password))) {
                    // Find or create the user
                    $user = User::firstOrCreate(
                        ['username' => $request->username],
                        [
                            'email' => "{$request->username}@gmail.com",
                            'password' => Hash::make($request->password),
                            'name' => 'Doe',
                            'nip' => "{$request->username}12345",
                            'division' => 'IT',
                            'role' => 'user',
                            'job_level' => 'staff',
                            'immediate_spv' => '23456',
                        ]
                    );

                    Auth::login($user, $remember);
                    return $this->successResponse($credentials);
                }
            } catch (\Throwable $th) {
                return $this->attemptLocalLogin($credentials, $remember);
            }
        }

        // Fallback to local login if not in LDAP environment
        return $this->attemptLocalLogin($credentials, $remember);
    }

    // Helper function for handling local login attempts
    private function attemptLocalLogin(array $credentials, bool $remember)
    {
        $user = User::where('username', $credentials['username'])->first();

        if (!$user) {
            return $this->errorResponse('username not found', 400, [
                'username' => ['The provided email does not match our records.']
            ]);
        }

        if (Auth::attempt($credentials, $remember)) {
            return $this->successResponse($credentials);
        }

        return $this->errorResponse('Password incorrect', 400, [
            'password' => ['The provided password is incorrect.']
        ]);
    }


    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('auth::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('auth::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function logout()
    {
        Auth::logout(); // Mengeluarkan pengguna yang sedang aktif
        return redirect('/login')->with('success', 'You have been logged out successfully.');
    }
}
