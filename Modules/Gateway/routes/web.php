<?php

use Illuminate\Support\Facades\Route;
use Modules\Gateway\Http\Controllers\GatewayController;
use Modules\Gateway\Http\Controllers\GatewayValueController;
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
        Route::group(['prefix' => 'api'], function () {
            Route::inertia('/', 'Gateway/Api/Index');
            Route::inertia('/create', 'Gateway/Api/Create');
            Route::inertia('/update/{id}', 'Gateway/Api/Update', [
                'id' => fn() => request()->route('id'),
            ]);
            Route::inertia('/detail/{id}', 'Gateway/Api/Detail', [
                'id' => fn() => request()->route('id'),
            ]);
        });
        Route::group(['prefix' => 'value'], function () {
            Route::inertia('/create/{id}', 'Gateway/Api/Value/Create', [
                'id' => fn() => request()->route('id'),
            ]);
            Route::inertia('/update/{id}', 'Gateway/Api/Value/Update', [
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

    Route::group(['prefix' => 'api/api', 'middleware' => 'auth'], function () {
        Route::get('/list', [GatewayController::class, 'index'])->name('secret.api.index');
        Route::post('/create', [GatewayController::class, 'store'])->name('secret.api.store');
        Route::post('/update/{id}', [GatewayController::class, 'update'])->name('secret.api.update');
        Route::get('/detail/{id}', [GatewayController::class, 'show'])->name('secret.api.show');
        Route::delete('/delete/{id}', [GatewayController::class, 'destroy'])->name('secret.api.destroy');
    });

    Route::group(['prefix' => 'api/value', 'middleware' => 'auth'], function () {
        Route::get('/list', [GatewayValueController::class, 'index'])->name('secret.value.index');
        Route::post('/create', [GatewayValueController::class, 'store'])->name('secret.value.store');
        Route::post('/update/{id}', [GatewayValueController::class, 'update'])->name('secret.value.update');
        Route::get('/detail/{id}', [GatewayValueController::class, 'show'])->name('secret.value.show');
        Route::delete('/delete/{id}', [GatewayValueController::class, 'destroy'])->name('secret.value.destroy');
    });
});
