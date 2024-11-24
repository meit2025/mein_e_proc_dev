<?php

use App\Http\Middleware\PermissionMiddleware;
use Illuminate\Support\Facades\Route;
use Modules\Auth\Http\Controllers\AuthController;
use Modules\Auth\Http\Controllers\PermissionController;
use Modules\Auth\Http\Controllers\RoleController;

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



Route::get('/login', [AuthController::class, 'index'])->name('login');
Route::post('/login', [AuthController::class, 'store'])->name('login.store');
Route::get('/logout', [AuthController::class, 'logout'])->name('login.logout');
Route::group(['middleware' => 'auth'], function () {

    Route::group(['prefix' => 'user-management'], function () {
        Route::group(['prefix' => 'permission'], function () {
            Route::inertia('/',  'UserManagement/Permission/Index')->middleware(PermissionMiddleware::class . ':role permission view');
            Route::inertia('/create',  'UserManagement/Permission/Create')->middleware(PermissionMiddleware::class . ':role permission create');
            Route::inertia('/update/{id}',  'UserManagement/Permission/Update', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':role permission update');
        });
        Route::group(['prefix' => 'role'], function () {
            Route::inertia('/',  'UserManagement/Role/Index')->middleware(PermissionMiddleware::class . ':role view');
            Route::inertia('/create',  'UserManagement/Role/Create')->middleware(PermissionMiddleware::class . ':role create');
            Route::inertia('/update/{id}',  'UserManagement/Role/Update', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':role update');
            Route::inertia('/detail/{id}',  'UserManagement/Role/Detail', [
                'id' => fn() => request()->route('id'),
            ])->middleware(PermissionMiddleware::class . ':role detail');
        });
    });



    Route::group(['prefix' => 'api/user-management'], function () {
        Route::group(['prefix' => 'permission'], function () {
            Route::get('/list', [PermissionController::class, 'index'])->name('user-management.permission.index')->middleware(PermissionMiddleware::class . ':role permission view');
            Route::get('/list-permission', [PermissionController::class, 'listPermission'])->name('user-management.permission.listPermission')->middleware(PermissionMiddleware::class . ':role permission view');
            Route::post('/create', [PermissionController::class, 'store'])->name('user-management.permission.store')->middleware(PermissionMiddleware::class . ':role permission create');
            Route::post('/update/{id}', [PermissionController::class, 'update'])->name('user-management.permission.update')->middleware(PermissionMiddleware::class . ':role permission update');
            Route::get('/detail/{id}', [PermissionController::class, 'show'])->name('user-management.permission.show')->middleware(PermissionMiddleware::class . ':role permission view');
            Route::delete('/delete/{id}', [PermissionController::class, 'destroy'])->name('user-management.permission.destroy')->middleware(PermissionMiddleware::class . ':role permission delete');
        });
        Route::group(['prefix' => 'role'], function () {
            Route::get('/list', [RoleController::class, 'index'])->name('user-management.role.index')->middleware(PermissionMiddleware::class . ':role view');
            Route::post('/create', [RoleController::class, 'store'])->name('user-management.role.store')->middleware(PermissionMiddleware::class . ':role create');
            Route::post('/update/{role}', [RoleController::class, 'update'])->name('user-management.role.update')->middleware(PermissionMiddleware::class . ':role update');
            Route::get('/detail/{id}', [RoleController::class, 'show'])->name('user-management.role.show')->middleware(PermissionMiddleware::class . ':role detail');
            Route::delete('/delete/{id}', [RoleController::class, 'destroy'])->name('user-management.role.destroy')->middleware(PermissionMiddleware::class . ':role delete');
        });
    });
});
