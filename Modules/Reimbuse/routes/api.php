<?php

use Illuminate\Support\Facades\Route;
use Modules\Reimbuse\Http\Controllers\ReimbuseController;

/*
 *--------------------------------------------------------------------------
 * API Routes
 *--------------------------------------------------------------------------
 *
 * Here is where you can register API routes for your application. These
 * routes are loaded by the RouteServiceProvider within a group which
 * is assigned the "api" middleware group. Enjoy building your API!
 *
*/

// Route::group(['middleware' => 'auth'], function () {
Route::group(['prefix' => 'reimburse'], function () {
    Route::get('/', [ReimbuseController::class, 'list'])->name('api.reimburse.list');
    Route::PUT('/update/{id}', [ReimbuseController::class, 'update'])->name('api.reimburse.update');
    Route::POST('/store', [ReimbuseController::class, 'store'])->name('api.reimburse.store');
    Route::DELETE('/destory/{id}', [ReimbuseController::class, 'destroy'])->name('api.reimburse.destroy');
});
// });
