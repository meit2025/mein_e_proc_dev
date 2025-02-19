<?php

use App\Events\GotMessage;
use App\Events\NotifikasiUsers;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\PortalController;
use App\Jobs\SendNotification;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Modules\BusinessTrip\Models\BusinessTrip;
use Illuminate\Support\Facades\Storage;

// Route::get('/login', [AuthController::class, 'login'])->name('login');
// Route::post('/login', [AuthController::class, 'store'])->name('login.store');

Route::get('/test-upload-file', function () {
    $fileName = 'example' . date('Ymd_His') . '.txt';
    $content = "example txt";

    Storage::disk(env('STORAGE_UPLOAD', 'local'))->put($fileName, $content);
    return response()->json([
        'sukses' => 'sukses'
    ]);
});
Route::get('/test-email', [NotifikasiController::class, 'sendTestEmail']);
Route::get('/test-conntect-access', [CurrencyController::class, 'ConntectAccess']);

Route::get('/test', function () {
    // $fileContents = file_get_contents('http://127.0.0.1:8008/storage/business_trip/dummy_1736238179.pdf');
    // dd($fileContents);
    $url = 'http://127.0.0.1:8008/storage/business_trip/dummy_1736238179.pdf';
    // return saveImageFromUrl($url);
    // Membuat instance Guzzle client
    $client = new Client();

    // Mengambil gambar dari URL
    $response = $client->get($url);
    // Mendapatkan konten gambar
    $imageContent = $response->getBody()->getContents();

    // Menentukan nama file dan path penyimpanan
    $fileName = basename($url); // Mengambil nama file dari URL
    $path = 'business_trip/' . 'clone-' . time() . $fileName; // Menentukan path penyimpanan

    // Menyimpan gambar ke storage
    Storage::disk('public')->put($path, $imageContent);

    return 'Gambar berhasil disimpan di: ' . $path;
});

Route::group(['middleware' => 'auth'], function () {
    Route::get('/test-notif', function () {
        SendNotification::dispatch(Auth::user(),  'Test Notifikasi', 'gateway/api');
        return response()->json([
            'sukses' => 'sukses'
        ]);
    });

    Route::get('/portal', [PortalController::class, 'index'])->name('portal');


    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/filter', [DashboardController::class, 'filter'])->name('dashboard.filter');
    Route::get('/role', [DashboardController::class, 'roles'])->name('roles');
    Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('index.notifikasi');
    Route::get('/notifikasi/read', [NotifikasiController::class, 'read'])->name('read.notifikasi');
    Route::get('/notifikasi/delete', [NotifikasiController::class, 'destory'])->name('destory.notifikasi');
    Route::post('/currency-conversion', [CurrencyController::class, 'ConversionCurrency'])->name('currency.conversion');
});
