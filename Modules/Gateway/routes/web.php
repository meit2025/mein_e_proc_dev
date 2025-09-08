<?php

use App\Http\Middleware\PermissionMiddleware;
use Illuminate\Support\Facades\Route;
use Modules\Gateway\Http\Controllers\GatewayController;
use Modules\Gateway\Http\Controllers\GatewayValueController;
use Modules\Gateway\Http\Controllers\LogController;
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

// // Routes untuk Gateway
Route::group(['middleware' => 'auth'], function () {
    // Gateway Routes
    Route::group(['prefix' => 'gateway'], function () {
        // Secret Routes
        Route::group(['prefix' => 'secret'], function () {
            Route::inertia('/', 'Gateway/Secret/Index')
                ->middleware(PermissionMiddleware::class . ':secret view');
            Route::inertia('/create', 'Gateway/Secret/Create')
                ->middleware(PermissionMiddleware::class . ':secret create');
            Route::inertia('/update/{id}', 'Gateway/Secret/Update', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':secret update');
        });

        // API Routes
        Route::group(['prefix' => 'api'], function () {
            Route::inertia('/', 'Gateway/Api/Index')
                ->middleware(PermissionMiddleware::class . ':api view');
            Route::inertia('/create', 'Gateway/Api/Create')
                ->middleware(PermissionMiddleware::class . ':api create');
            Route::inertia('/update/{id}', 'Gateway/Api/Update', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':api update');
            Route::inertia('/detail/{id}', 'Gateway/Api/Detail', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':api view');
        });

        // Value Routes
        Route::group(['prefix' => 'value'], function () {
            Route::inertia('/create/{id}', 'Gateway/Api/Value/Create', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':api create');
            Route::inertia('/update/{id}', 'Gateway/Api/Value/Update', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':api update');
        });
    });

    // API for Secret
    Route::group(['prefix' => 'api/secret'], function () {
        Route::get('/list', [SecretController::class, 'index'])
            ->name('secret.employees.index')
            ->middleware(PermissionMiddleware::class . ':secret view');
        Route::post('/create', [SecretController::class, 'store'])
            ->name('secret.employees.store')
            ->middleware(PermissionMiddleware::class . ':secret create');
        Route::post('/update/{id}', [SecretController::class, 'update'])
            ->name('secret.employees.update')
            ->middleware(PermissionMiddleware::class . ':secret update');
        Route::get('/detail/{id}', [SecretController::class, 'show'])
            ->name('secret.employees.show')
            ->middleware(PermissionMiddleware::class . ':secret view');
        Route::delete('/delete/{id}', [SecretController::class, 'destroy'])
            ->name('secret.employees.destroy')
            ->middleware(PermissionMiddleware::class . ':secret delete');
    });

    // API for API Routes
    Route::group(['prefix' => 'api/api'], function () {
        Route::get('/list', [GatewayController::class, 'index'])
            ->name('secret.api.index')
            ->middleware(PermissionMiddleware::class . ':api view');
        Route::post('/create', [GatewayController::class, 'store'])
            ->name('secret.api.store')
            ->middleware(PermissionMiddleware::class . ':api create');
        Route::post('/update/{id}', [GatewayController::class, 'update'])
            ->name('secret.api.update')
            ->middleware(PermissionMiddleware::class . ':api update');
        Route::get('/detail/{id}', [GatewayController::class, 'show'])
            ->name('secret.api.show')
            ->middleware(PermissionMiddleware::class . ':api view');
        Route::delete('/delete/{id}', [GatewayController::class, 'destroy'])
            ->name('secret.api.destroy')
            ->middleware(PermissionMiddleware::class . ':api delete');
    });

    // API for Value Routes
    Route::group(['prefix' => 'api/value'], function () {
        Route::get('/list', [GatewayValueController::class, 'index'])
            ->name('secret.value.index')
            ->middleware(PermissionMiddleware::class . ':api view');
        Route::post('/create', [GatewayValueController::class, 'store'])
            ->name('secret.value.store')
            ->middleware(PermissionMiddleware::class . ':api create');
        Route::post('/update/{id}', [GatewayValueController::class, 'update'])
            ->name('secret.value.update')
            ->middleware(PermissionMiddleware::class . ':api update');
        Route::get('/detail/{id}', [GatewayValueController::class, 'show'])
            ->name('secret.value.show')
            ->middleware(PermissionMiddleware::class . ':api view');
        Route::delete('/delete/{id}', [GatewayValueController::class, 'destroy'])
            ->name('secret.value.destroy')
            ->middleware(PermissionMiddleware::class . ':api delete');
    });

    // API for Log Routes
    Route::group(['prefix' => 'api/log'], function () {
        Route::get('/list', [LogController::class, 'index'])
            ->name('secret.log.index')
            ->middleware(PermissionMiddleware::class . ':secret view');
    });
});
