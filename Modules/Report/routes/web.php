<?php

use App\Http\Middleware\PermissionMiddleware;
use Illuminate\Support\Facades\Route;
use Modules\Report\Http\Controllers\ReportController;

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

// Route::group([], function () {
//     Route::resource('report', ReportController::class)->names('report');
// });

Route::group(['prefix' => 'report'], function () {
    Route::get('/', [ReportController::class, 'index'])->name('report.index');
    Route::get('/bt-request', [ReportController::class, 'businessTrip'])->name('report.btRequest');
    Route::get('/bt-dec', [ReportController::class, 'businessTripDec'])->name('report.btDec');
    Route::inertia('/purchase',  'Report/PurchaseRequisition/Index')->middleware(PermissionMiddleware::class . ':report purchase requisition view');
});
