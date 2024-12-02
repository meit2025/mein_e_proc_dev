<?php

use App\Http\Middleware\PermissionMiddleware;
use Illuminate\Support\Facades\Route;
use Modules\Approval\Http\Controllers\ApprovalController;
use Modules\Approval\Http\Controllers\ApprovalPrController;
use Modules\Approval\Http\Controllers\ApprovalToUserController;
use Modules\Approval\Http\Controllers\ApprovalTrackingNumberAutoController;
use Modules\Approval\Http\Controllers\ApprovalTrackingNumberChooseController;
use Modules\Approval\Http\Controllers\SettingApprovalController;
use Modules\Approval\Models\ApprovalTrackingNumberAuto;

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
            Route::inertia('/',  'Approval/Route/Index')->middleware(PermissionMiddleware::class . ':approval view');
            Route::inertia('/create',  'Approval/Route/Create')->middleware(PermissionMiddleware::class . ':approval create');
            Route::inertia('/update/{id}',  'Approval/Route/Update', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':approval update');
            Route::inertia('/detail/{id}',  'Approval/Route/Detail', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':approval view');
        });

        Route::group(['prefix' => 'pr'], function () {
            Route::inertia('/',  'Approval/Pr/Index')->middleware(PermissionMiddleware::class . ':approval pr view');
            Route::inertia('/create',  'Approval/Pr/Create')->middleware(PermissionMiddleware::class . ':approval pr create');
            Route::inertia('/update/{id}',  'Approval/Pr/Update', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':approval pr update');
            Route::inertia('/detail/{id}',  'Approval/Pr/Detail', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':approval pr view');
        });

        Route::group(['prefix' => 'setting'], function () {
            Route::inertia('/',  'Approval/Setting/Index')->middleware(PermissionMiddleware::class . ':setting view');
            Route::inertia('/create',  'Approval/Setting/Create')->middleware(PermissionMiddleware::class . ':setting create');
            Route::inertia('/update/{id}',  'Approval/Setting/Update', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':setting update');
            Route::inertia('/detail/{id}',  'Approval/Setting/Detail', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':setting view');
        });

        Route::group(['prefix' => 'tracking-number-auto'], function () {
            Route::inertia('/',  'Approval/TrackingNumberAuto/Index')->middleware(PermissionMiddleware::class . ':tracking number auto view');
            Route::inertia('/create',  'Approval/TrackingNumberAuto/Create')->middleware(PermissionMiddleware::class . ':tracking number auto create');
            Route::inertia('/update/{id}',  'Approval/TrackingNumberAuto/Update', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':tracking number auto update');
            Route::inertia('/detail/{id}',  'Approval/TrackingNumberAuto/Detail', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':tracking number auto view');
        });

        Route::group(['prefix' => 'tracking-number-choose'], function () {
            Route::inertia('/',  'Approval/TrackingNumberChoose/Index')->middleware(PermissionMiddleware::class . ':tracking number choose view');
            Route::inertia('/create',  'Approval/TrackingNumberChoose/Create')->middleware(PermissionMiddleware::class . ':tracking number choose create');
            Route::inertia('/update/{id}',  'Approval/TrackingNumberChoose/Update', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':tracking number choose update');
            Route::inertia('/detail/{id}',  'Approval/TrackingNumberChoose/Detail', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':tracking number choose view');
        });
    });
    Route::group(['prefix' => 'api/approval', 'middleware' => 'auth'], function () {
        Route::group(['prefix' => 'route'], function () {
            Route::get('/list', [ApprovalController::class, 'index'])->name('approval.route.index')->middleware(PermissionMiddleware::class . ':approval view');
            Route::post('/create', [ApprovalController::class, 'store'])->name('approval.route.store')->middleware(PermissionMiddleware::class . ':approval create');
            Route::post('/update/{id}', [ApprovalController::class, 'update'])->name('approval.route.update')->middleware(PermissionMiddleware::class . ':approval update');
            Route::get('/detail/{id}', [ApprovalController::class, 'show'])->name('approval.route.show')->middleware(PermissionMiddleware::class . ':approval view');
            Route::delete('/delete/{id}', [ApprovalController::class, 'destroy'])->name('approval.route.destroy')->middleware(PermissionMiddleware::class . ':approval delete');
            Route::get('/getApproval', [ApprovalController::class, 'getApproval'])->name('approval.route.destroy');
        });

        Route::post('/approval_or_rejceted', [ApprovalController::class, 'ApprovalOrRejceted'])->name('approval.route.ApprovalOrRejceted');

        Route::group(['prefix' => 'setting'], function () {
            Route::get('/list', [SettingApprovalController::class, 'index'])->name('approval.setting.index')->middleware(PermissionMiddleware::class . ':setting view');
            Route::post('/create', [SettingApprovalController::class, 'store'])->name('approval.setting.store')->middleware(PermissionMiddleware::class . ':setting create');
            Route::post('/update/{id}', [SettingApprovalController::class, 'update'])->name('approval.setting.update')->middleware(PermissionMiddleware::class . ':setting update');
            Route::get('/detail/{id}', [SettingApprovalController::class, 'show'])->name('approval.setting.show')->middleware(PermissionMiddleware::class . ':setting view');
            Route::delete('/delete/{id}', [SettingApprovalController::class, 'destroy'])->name('approval.setting.destroy')->middleware(PermissionMiddleware::class . ':setting delete');
        });

        Route::group(['prefix' => 'pr'], function () {
            Route::get('/list', [ApprovalPrController::class, 'index'])->name('approval.pr.index')->middleware(PermissionMiddleware::class . ':approval pr view');
            Route::post('/create', [ApprovalPrController::class, 'store'])->name('approval.pr.store')->middleware(PermissionMiddleware::class . ':approval pr create');
            Route::post('/update/{id}', [ApprovalPrController::class, 'update'])->name('approval.pr.update')->middleware(PermissionMiddleware::class . ':approval pr update');
            Route::get('/detail/{id}', [ApprovalPrController::class, 'show'])->name('approval.pr.show')->middleware(PermissionMiddleware::class . ':approval pr view');
            Route::delete('/delete/{id}', [ApprovalPrController::class, 'destroy'])->name('approval.pr.destroy')->middleware(PermissionMiddleware::class . ':approval pr delete');
        });


        Route::group(['prefix' => 'tracking-number-auto'], function () {
            Route::get('/list', [ApprovalTrackingNumberAutoController::class, 'index'])->name('approval.tr-auto.index')->middleware(PermissionMiddleware::class . ':tracking number auto view');
            Route::post('/create', [ApprovalTrackingNumberAutoController::class, 'store'])->name('approval.tr-auto.store')->middleware(PermissionMiddleware::class . ':tracking number auto create');
            Route::post('/update/{id}', [ApprovalTrackingNumberAutoController::class, 'update'])->name('approval.tr-auto.update')->middleware(PermissionMiddleware::class . ':tracking number auto update');
            Route::get('/detail/{id}', [ApprovalTrackingNumberAutoController::class, 'show'])->name('approval.tr-auto.show')->middleware(PermissionMiddleware::class . ':tracking number auto view');
            Route::delete('/delete/{id}', [ApprovalTrackingNumberAutoController::class, 'destroy'])->name('approval.tr-auto.destroy')->middleware(PermissionMiddleware::class . ':tracking number auto delete');
        });
        Route::group(['prefix' => 'tracking-number-choose'], function () {
            Route::get('/list', [ApprovalTrackingNumberChooseController::class, 'index'])->name('approval.tr-choose.index')->middleware(PermissionMiddleware::class . ':tracking number choose view');
            Route::post('/create', [ApprovalTrackingNumberChooseController::class, 'store'])->name('approval.tr-choose.store')->middleware(PermissionMiddleware::class . ':tracking number choose create');
            Route::post('/update/{id}', [ApprovalTrackingNumberChooseController::class, 'update'])->name('approval.tr-choose.update')->middleware(PermissionMiddleware::class . ':tracking number choose update');
            Route::get('/detail/{id}', [ApprovalTrackingNumberChooseController::class, 'show'])->name('approval.tr-choose.show')->middleware(PermissionMiddleware::class . ':tracking number choose view');
            Route::delete('/delete/{id}', [ApprovalTrackingNumberChooseController::class, 'destroy'])->name('approval.tr-choose.destroy')->middleware(PermissionMiddleware::class . ':tracking number choose delete');
        });
        Route::group(['prefix' => 'approval-to-user'], function () {
            Route::get('/list', [ApprovalToUserController::class, 'index'])->name('approval.to-users.index')->middleware(PermissionMiddleware::class . ':approval view');
            Route::post('/create', [ApprovalToUserController::class, 'store'])->name('approval.to-users.store')->middleware(PermissionMiddleware::class . ':approval update');
            Route::post('/update/{id}', [ApprovalToUserController::class, 'update'])->name('approval.to-users.update')->middleware(PermissionMiddleware::class . ':approval update');
            Route::get('/detail/{id}', [ApprovalToUserController::class, 'show'])->name('approval.to-users.show')->middleware(PermissionMiddleware::class . ':approval view');

            Route::get('/get-user-dropdown/{id}', [ApprovalToUserController::class, 'getUsersDropdown'])->name('approval.to-users.getUsersDropdown')->middleware(PermissionMiddleware::class . ':approval update');
        });
    });
});
