<?php

use Illuminate\Support\Facades\Route;
use Modules\Gateway\Http\Controllers\GatewayController;
use Modules\Gateway\Http\Controllers\SecretController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['middleware' => 'auth'], function () {
    Route::group(['prefix' => 'gateway'], function () {
        Route::group(['prefix' => 'secret'], function () {
            Route::inertia('/', 'Gateway/Secret/Index');
            Route::inertia('/create', 'Gateway/Secret/Create');
            Route::inertia('/update/{id}', 'Gateway/Secret/Update', [
                'id' => fn() => request()->route('id'),
            ]);
        });
    });

    Route::group(['prefix' => 'api/secret', 'middleware' => 'auth'], function () {
        Route::get('/list', [SecretController::class, 'index'])->name('secret.employees.index');
        Route::post('/create', [SecretController::class, 'store'])->name('secret.employees.store');
        Route::post('/update/{id}', [SecretController::class, 'update'])->name('secret.employees.update');
        Route::get('/detail/{id}', [SecretController::class, 'show'])->name('secret.employees.show');
        Route::delete('/delete/{id}', [SecretController::class, 'destroy'])->name('secret.employees.destroy');
    });
});
