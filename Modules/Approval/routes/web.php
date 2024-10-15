<?php

use Illuminate\Support\Facades\Route;
use Modules\Approval\Http\Controllers\ApprovalController;
use Modules\Approval\Http\Controllers\SettingApprovalController;

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
    Route::group(['prefix' => 'approval'], function () {
        Route::group(['prefix' => 'route'], function () {
            Route::inertia('/',  'Approval/Route/Index');
            Route::inertia('/create',  'Approval/Route/Create');
            Route::inertia('/update/{id}',  'Approval/Route/Update', [
                'id' => fn() => request()->route('id'),
            ]);
            Route::inertia('/detail/{id}',  'Approval/Route/Detail', [
                'id' => fn() => request()->route('id'),
            ]);
        });

        Route::group(['prefix' => 'setting'], function () {
            Route::inertia('/',  'Approval/Setting/Index');
            Route::inertia('/create',  'Approval/Setting/Create');
            Route::inertia('/update/{id}',  'Approval/Setting/Update', [
                'id' => fn() => request()->route('id'),
            ]);
            Route::inertia('/detail/{id}',  'Approval/Setting/Detail', [
                'id' => fn() => request()->route('id'),
            ]);
        });
    });
    Route::group(['prefix' => 'api/approval', 'middleware' => 'auth'], function () {
        Route::group(['prefix' => 'route'], function () {
            Route::get('/list', [ApprovalController::class, 'index'])->name('approval.route.index');
            Route::post('/create', [ApprovalController::class, 'store'])->name('approval.route.store');
            Route::post('/update/{id}', [ApprovalController::class, 'update'])->name('approval.route.update');
            Route::get('/detail/{id}', [ApprovalController::class, 'show'])->name('approval.route.show');
            Route::delete('/delete/{id}', [ApprovalController::class, 'destroy'])->name('approval.route.destroy');
        });
        Route::group(['prefix' => 'setting'], function () {
            Route::get('/list', [SettingApprovalController::class, 'index'])->name('approval.setting.index');
            Route::post('/create', [SettingApprovalController::class, 'store'])->name('approval.setting.store');
            Route::post('/update/{id}', [SettingApprovalController::class, 'update'])->name('approval.setting.update');
            Route::get('/detail/{id}', [SettingApprovalController::class, 'show'])->name('approval.setting.show');
            Route::delete('/delete/{id}', [SettingApprovalController::class, 'destroy'])->name('approval.setting.destroy');
        });
    });
});
