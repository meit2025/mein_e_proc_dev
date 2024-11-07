<?php

use Illuminate\Support\Facades\Route;
use Modules\PurchaseRequisition\Http\Controllers\ProcurementController;
use Modules\PurchaseRequisition\Http\Controllers\PurchaseRequisitionController;

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
    Route::group(['prefix' => 'purchase-requisition'], function () {
        Route::inertia('/',  'PurchaseRequisition/Index');
        Route::inertia('/create',  'PurchaseRequisition/Create');
        Route::inertia('/update/{id}',  'PurchaseRequisition/Update', [
            'id' => fn() => request()->route('id'),
        ]);
        Route::inertia('/detail/{id}',  'PurchaseRequisition/Detail', [
            'id' => fn() => request()->route('id'),
        ]);
    });

    Route::group(['prefix' => 'api/pr/purchase-requisition', 'middleware' => 'auth'], function () {
        Route::get('/list', [ProcurementController::class, 'index'])->name('pr.purchase-requisition.index');
        Route::post('/create', [ProcurementController::class, 'store'])->name('pr.purchase-requisition.store');
        Route::post('/update/{id}', [ProcurementController::class, 'update'])->name('pr.purchase-requisition.update');
        Route::get('/detail/{id}', [ProcurementController::class, 'show'])->name('pr.purchase-requisition.show');
        Route::delete('/delete/{id}', [ProcurementController::class, 'destroy'])->name('pr.purchase-requisition.destroy');
    });

    Route::group(['prefix' => 'api/pr/purchase-requisition-sap', 'middleware' => 'auth'], function () {
        Route::get('/list', [PurchaseRequisitionController::class, 'index'])->name('pr.purchase-requisition-sap.index');
        Route::get('/list-dp', [PurchaseRequisitionController::class, 'indexDp'])->name('pr.purchase-requisition-sap.indexDp');
        Route::get('/list-po', [PurchaseRequisitionController::class, 'indexPo'])->name('pr.purchase-requisition-sap.indexPo');
        Route::get('/text/{id}', [PurchaseRequisitionController::class, 'textData'])->name('pr.purchase-requisition-sap.text_id');
        Route::get('/text/{id}/{type}', [PurchaseRequisitionController::class, 'generateText'])->name('pr.generate-text-sap.text_id_type');
        Route::get('/downolad-text/{id}/{type}', [PurchaseRequisitionController::class, 'downloadtext'])->name('pr.generate-text-sap.download.text');
        Route::get('/downolad-text-po/{id}/{type}', [PurchaseRequisitionController::class, 'downloadPo'])->name('pr.generate-text-sap.download.po');
    });
});
