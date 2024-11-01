<?php

use App\Http\Controllers\FamilyController;
use Illuminate\Support\Facades\Route;
use Modules\Auth\Http\Controllers\AuthController;
use Modules\Reimbuse\Http\Controllers\ReimbuseController;

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

// Route::get('/login',[AuthController::class, 'index'])->name('auth.login-index');

Route::group(['prefix' => 'reimburse', 'middleware' => 'auth'], function () {
    Route::resource('/', ReimbuseController::class);
    Route::get('/type/{type}', [ReimbuseController::class, 'getTypeData']);
    Route::post('/is_required', [ReimbuseController::class, 'is_required']);


    Route::inertia('/detail/{id}',  'Reimburse/Detail', [
        'id' => fn() => request()->route('id'),
    ]);
});

Route::get('/family/show/{employee}', [FamilyController::class, 'show']);
