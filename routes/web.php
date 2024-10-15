<?php

use App\Events\GotMessage;
use App\Events\NotifikasiUsers;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotifikasiController;
use App\Jobs\SendNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Modules\BusinessTrip\Models\BusinessTrip;

// Route::get('/login', [AuthController::class, 'login'])->name('login');
// Route::post('/login', [AuthController::class, 'store'])->name('login.store');



Route::group(['middleware' => 'auth'], function () {
    Route::get('/test-notif', function () {
        SendNotification::dispatch(Auth::user(),  'Test Notifikasi', 'gateway/api');
        return response()->json([
            'sukses' => 'sukses'
        ]);
    });
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/role', [DashboardController::class, 'roles'])->name('roles');
    Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('index.notifikasi');
    Route::get('/notifikasi/read', [NotifikasiController::class, 'read'])->name('read.notifikasi');
    Route::get('/notifikasi/delete', [NotifikasiController::class, 'destory'])->name('destory.notifikasi');
});
