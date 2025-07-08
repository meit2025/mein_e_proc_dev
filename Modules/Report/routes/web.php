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

Route::group(['prefix' => 'report'], function () {
    Route::get('/', [ReportController::class, 'index'])->name('report.index');
    Route::get('/my-reimburse', [ReportController::class, 'myReimburse'])->name('report.my-reimburse');
    Route::get('/bt-request', [ReportController::class, 'businessTrip'])->name('report.btRequest');
    Route::get('/bt-dec', [ReportController::class, 'businessTripDec'])->name('report.btDec');
    Route::get('/bt-overall', [ReportController::class, 'businessTripOverall'])->name('report.btRequest');
    Route::get('/bt-attendance', [ReportController::class, 'businessTripAttendance'])->name('report.btAttendance');
    Route::inertia('/purchase',  'Report/PurchaseRequisition/Index')->middleware(PermissionMiddleware::class . ':report purchase requisition view');
});

Route::group(['prefix' => 'api/sunfish'], function () {

    Route::group(['prefix' => 'business-trip-attendance'], function () {

        Route::get('/list', [ReportController::class, 'listBTAttendanceSunfish'])->name('api.listBTAttendanceSunfish.index')
            // ->middleware(PermissionMiddleware::class . ':report business trip attendance view')
        ;
        
        Route::get('/list-monthly', [ReportController::class, 'listBTAttendanceSunfishMothly'])->name('api.listBTAttendanceSunfishMothly.index')
        ;
    });
});

Route::group(['prefix' => 'api/report', 'middleware' => 'auth'], function () {
    Route::group(['prefix' => 'reimburse'], function () {
        Route::get('/list', [ReportController::class, 'list'])->name('report.reimburse.index')->middleware(PermissionMiddleware::class . ':report reimburse view');
        Route::get('/export', [ReportController::class, 'export'])->name('report.reimburse.export')->middleware(PermissionMiddleware::class . ':report reimburse export');
    });
    Route::group(['prefix' => 'my-reimburse'], function () {
        Route::get('/list', [ReportController::class, 'listMyReimburse'])->name('report.my-reimburse.index')->middleware(PermissionMiddleware::class . ':report reimburse view');
        Route::get('/export', [ReportController::class, 'exportMyReimburse'])->name('report.my-reimburse.export')->middleware(PermissionMiddleware::class . ':report reimburse export');
    });
    Route::group(['prefix' => 'business-trip'], function () {
        Route::get('/list', [ReportController::class, 'listBT'])->name('report.business.index')->middleware(PermissionMiddleware::class . ':report business trip request view');
        Route::get('/export', [ReportController::class, 'exportBT'])->name('report.business.export')->middleware(PermissionMiddleware::class . ':report business trip request export');
    });
    Route::group(['prefix' => 'business-trip-dec'], function () {
        Route::get('/list', [ReportController::class, 'listBTDec'])->name('report.businessDec.index')->middleware(PermissionMiddleware::class . ':report business trip declaration view');
        Route::get('/export', [ReportController::class, 'exportBTDec'])->name('report.businessDec.export')->middleware(PermissionMiddleware::class . ':report business trip declaration export');
    });
    Route::group(['prefix' => 'business-trip-overall'], function () {
        Route::get('/list', [ReportController::class, 'listBTOverall'])->name('report.businessOverall.index')->middleware(PermissionMiddleware::class . ':report business trip overall view');
        Route::get('/export', [ReportController::class, 'exportBTOverall'])->name('report.businessOverall.export')->middleware(PermissionMiddleware::class . ':report business trip overall export');
    });
    Route::group(['prefix' => 'business-trip-attendance'], function () {
        Route::get('/list', [ReportController::class, 'listBTAttendance'])->name('report.BTAttendance.index')->middleware(PermissionMiddleware::class . ':report business trip attendance view');
        Route::get('/export', [ReportController::class, 'exportBTAttendance'])->name('report.BTAttendance.export')->middleware(PermissionMiddleware::class . ':report business trip attendance export');
    });
    Route::group(['prefix' => 'purchase'], function () {
        Route::get('/list', [ReportController::class, 'purchase'])->name('report.purchase.index')->middleware(PermissionMiddleware::class . ':report purchase requisition view');
        Route::get('/export', [ReportController::class, 'purchaseExport'])->name('report.purchase.export')->middleware(PermissionMiddleware::class . ':report purchase requisition export');
        Route::get('/types', [ReportController::class, 'purchaseTypes'])->name('report.purchase.types')->middleware(PermissionMiddleware::class . ':report purchase requisition view');
        Route::get('/departments', [ReportController::class, 'departments'])->name('report.purchase.departments')->middleware(PermissionMiddleware::class . ':report purchase requisition view');
        Route::get('/statuses', [ReportController::class, 'statuses'])->name('report.purchase.statuses')->middleware(PermissionMiddleware::class . ':report purchase requisition view');
        Route::get('/vendors', [ReportController::class, 'purchaseVendors'])->name('report.purchase.vendors')->middleware(PermissionMiddleware::class . ':report purchase requisition view');
    });
});
