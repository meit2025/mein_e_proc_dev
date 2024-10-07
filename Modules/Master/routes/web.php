<?php

use Illuminate\Support\Facades\Route;
use Modules\Master\Http\Controllers\AssetController;
use Modules\Master\Http\Controllers\BankKeyController;
use Modules\Master\Http\Controllers\CostCenterController;
use Modules\Master\Http\Controllers\DropdownMasterController;
use Modules\Master\Http\Controllers\MasterBusinessPartnerController;
use Modules\Master\Http\Controllers\MasterController;
use Modules\Master\Http\Controllers\MasterMaterialController;
use Modules\Master\Http\Controllers\OrderController;
use Modules\Master\Http\Controllers\ReconController;

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
    Route::group(['prefix' => 'master'], function () {
        Route::group(['prefix' => 'master-material'], function () {
            Route::inertia('/',  'Master/MasterMaterial/Index');
        });
        Route::group(['prefix' => 'asset'], function () {
            Route::inertia('/',  'Master/MasterAsset/Index');
        });
        Route::group(['prefix' => 'bank-key'], function () {
            Route::inertia('/',  'Master/MasterBankKey/Index');
        });
        Route::group(['prefix' => 'cost-center'], function () {
            Route::inertia('/',  'Master/MasterCostCenter/Index');
        });
        Route::group(['prefix' => 'order'], function () {
            Route::inertia('/',  'Master/MasterOrder/Index');
        });
        Route::group(['prefix' => 'recon'], function () {
            Route::inertia('/',  'Master/MasterRecon/Index');
        });
        Route::group(['prefix' => 'business-partner'], function () {
            Route::inertia('/',  'Master/MasterBusinessPartner/Index');
        });
    });

    Route::group(['prefix' => 'api/master', 'middleware' => 'auth'], function () {
        Route::group(['prefix' => 'master-material'], function () {
            Route::get('/list', [MasterMaterialController::class, 'index'])->name('master.master-material.index');
            Route::post('/create', [MasterMaterialController::class, 'store'])->name('master.master-material.store');
            Route::post('/update/{id}', [MasterMaterialController::class, 'update'])->name('master.master-material.update');
            Route::get('/detail/{id}', [MasterMaterialController::class, 'show'])->name('master.master-material.show');
            Route::delete('/delete/{id}', [MasterMaterialController::class, 'destroy'])->name('master.master-material.destroy');
        });
        Route::group(['prefix' => 'asset'], function () {
            Route::get('/list', [AssetController::class, 'index'])->name('master.asset.index');
            Route::post('/create', [AssetController::class, 'store'])->name('master.asset.store');
            Route::post('/update/{id}', [AssetController::class, 'update'])->name('master.asset.update');
            Route::get('/detail/{id}', [AssetController::class, 'show'])->name('master.asset.show');
            Route::delete('/delete/{id}', [AssetController::class, 'destroy'])->name('master.asset.destroy');
        });
        Route::group(['prefix' => 'bank-key'], function () {
            Route::get('/list', [BankKeyController::class, 'index'])->name('master.bank-key.index');
            Route::post('/create', [BankKeyController::class, 'store'])->name('master.bank-key.store');
            Route::post('/update/{id}', [BankKeyController::class, 'update'])->name('master.bank-key.update');
            Route::get('/detail/{id}', [BankKeyController::class, 'show'])->name('master.bank-key.show');
            Route::delete('/delete/{id}', [BankKeyController::class, 'destroy'])->name('master.bank-key.destroy');
        });
        Route::group(['prefix' => 'cost-center'], function () {
            Route::get('/list', [CostCenterController::class, 'index'])->name('master.cost-center.index');
            Route::post('/create', [CostCenterController::class, 'store'])->name('master.cost-center.store');
            Route::post('/update/{id}', [CostCenterController::class, 'update'])->name('master.cost-center.update');
            Route::get('/detail/{id}', [CostCenterController::class, 'show'])->name('master.cost-center.show');
            Route::delete('/delete/{id}', [CostCenterController::class, 'destroy'])->name('master.cost-center.destroy');
        });
        Route::group(['prefix' => 'order'], function () {
            Route::get('/list', [OrderController::class, 'index'])->name('master.order.index');
            Route::post('/create', [OrderController::class, 'store'])->name('master.order.store');
            Route::post('/update/{id}', [OrderController::class, 'update'])->name('master.order.update');
            Route::get('/detail/{id}', [OrderController::class, 'show'])->name('master.order.show');
            Route::delete('/delete/{id}', [OrderController::class, 'destroy'])->name('master.order.destroy');
        });
        Route::group(['prefix' => 'recon'], function () {
            Route::get('/list', [ReconController::class, 'index'])->name('master.recon.index');
            Route::post('/create', [ReconController::class, 'store'])->name('master.recon.store');
            Route::post('/update/{id}', [ReconController::class, 'update'])->name('master.recon.update');
            Route::get('/detail/{id}', [ReconController::class, 'show'])->name('master.recon.show');
            Route::delete('/delete/{id}', [ReconController::class, 'destroy'])->name('master.recon.destroy');
        });

        Route::group(['prefix' => 'business-parner'], function () {
            Route::get('/list', [MasterBusinessPartnerController::class, 'index'])->name('master.business.index');
            Route::post('/create', [MasterBusinessPartnerController::class, 'store'])->name('master.business.store');
            Route::post('/update/{id}', [MasterBusinessPartnerController::class, 'update'])->name('master.business.update');
            Route::get('/detail/{id}', [MasterBusinessPartnerController::class, 'show'])->name('master.business.show');
            Route::delete('/delete/{id}', [MasterBusinessPartnerController::class, 'destroy'])->name('master.business.destroy');
        });
        Route::group(['prefix' => 'dropdown'], function () {
            Route::get('/', [DropdownMasterController::class, 'dropdown'])->name('master.dropdown');
        });
    });
});
