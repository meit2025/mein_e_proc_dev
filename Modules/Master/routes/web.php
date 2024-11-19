<?php

use Illuminate\Support\Facades\Route;
use Modules\Master\Http\Controllers\AccountAssignmentCategoryController;
use Modules\Master\Http\Controllers\AssetController;
use Modules\Master\Http\Controllers\BankKeyController;
use Modules\Master\Http\Controllers\CostCenterController;
use Modules\Master\Http\Controllers\DataDropdownController;
use Modules\Master\Http\Controllers\DokumentTypeController;
use Modules\Master\Http\Controllers\DropdownMasterController;
use Modules\Master\Http\Controllers\FamilyController;
use Modules\Master\Http\Controllers\ItemCategoryController;
use Modules\Master\Http\Controllers\MasterBusinessPartnerController;
use Modules\Master\Http\Controllers\MasterMaterialController;
use Modules\Master\Http\Controllers\MaterialGroupController;
use Modules\Master\Http\Controllers\MasterPeriodReimburseController;
use Modules\Master\Http\Controllers\MasterQuotaReimburseController;
use Modules\Master\Http\Controllers\MasterTypeReimburseController;
use Modules\Master\Http\Controllers\OrderController;
use Modules\Master\Http\Controllers\PajakController;
use Modules\Master\Http\Controllers\PurchasingGroupController;
use Modules\Master\Http\Controllers\ReconController;
use Modules\Master\Http\Controllers\StorageLocationController;
use Modules\Master\Http\Controllers\UomController;
use Modules\Master\Http\Controllers\ValuationTypeController;
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
        Route::group(['prefix' => 'reimburse-period'], function () {
            Route::inertia('/',  'Master/MasterReimbursePeriod/Index');
        });
        Route::get('reimburse-type/', [MasterTypeReimburseController::class, 'index'])->name('type.master.reimburse-type.index');
        Route::get('reimburse-quota/', [MasterQuotaReimburseController::class, 'index'])->name('master.reimburse-quota.index');
        Route::get('reimburse-quota/detail/{id}', [MasterQuotaReimburseController::class, 'detail'])->name('master.reimburse-quota.detail');
        Route::get('family/', [FamilyController::class, 'index'])->name('master.family.index');
    });

    Route::group(['prefix' => 'api/master', 'middleware' => 'auth'], function () {
        Route::group(['prefix' => 'master-material'], function () {
            Route::get('/list', [MasterMaterialController::class, 'index'])->name('master.master-material.index');
            Route::post('/create', [MasterMaterialController::class, 'store'])->name('master.master-material.store');
            Route::post('/update/{id}', [MasterMaterialController::class, 'update'])->name('master.master-material.update');
            Route::get('/detail/{id}', [MasterMaterialController::class, 'show'])->name('master.master-material.show');
            Route::delete('/delete/{id}', [MasterMaterialController::class, 'destroy'])->name('master.master-material.destroy');
            route::get("/get-list-material-by-material-group/{material_group}", [MasterMaterialController::class, 'getListMaterialByMaterialGroupAPI'])->name('master.get-master-material-by-material-group');
            Route::get('/get-dropdown-master-material-number', [MasterMaterialController::class, 'getListMasterMaterialNumberAPI'])->name('dropdown-master-material-number');

            Route::get('/get-dropdown-master-material-number/by-material-group/{material_group}', [MasterMaterialController::class, 'getListMasterMaterialNumberByMaterialGroupAPI'])->name('dropdown-master-material-number-by-material-group');


            Route::get('/get-dropdown-master-material-group', [MasterMaterialController::class, 'getListMasterMaterialGroupAPI'])->name('dropdown-master-material-group');
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

        Route::group(['prefix' => 'reimburse-type'], function () {
            Route::get('/', [MasterTypeReimburseController::class, 'list'])->name('master.reimburse-type.list');
            Route::get('/listUserGrade/{id}', [MasterTypeReimburseController::class, 'listGradeUsers'])->name('master.listUserGrade');
            Route::post('/create', [MasterTypeReimburseController::class, 'store'])->name('master.reimburse-type.store');
            Route::put('/update/{id}', [MasterTypeReimburseController::class, 'update'])->name('master.reimburse-type.update');
            Route::get('/edit/{id}', [MasterTypeReimburseController::class, 'edit'])->name('master.reimburse-type.edit');
            Route::delete('/delete/{id}', [MasterTypeReimburseController::class, 'destroy'])->name('master.reimburse-type.destroy');
        });

        Route::group(['prefix' => 'reimburse-period'], function () {
            Route::get('/list', [MasterPeriodReimburseController::class, 'index'])->name('master.reimburse-period.index');
            Route::post('/create', [MasterPeriodReimburseController::class, 'store'])->name('master.reimburse-period.store');
            Route::put('/update/{id}', [MasterPeriodReimburseController::class, 'update'])->name('master.reimburse-period.update');
            Route::get('/edit/{id}', [MasterPeriodReimburseController::class, 'edit'])->name('master.reimburse-period.edit');
            Route::delete('/delete/{id}', [MasterPeriodReimburseController::class, 'destroy'])->name('master.reimburse-period.destroy');
        });

        Route::group(['prefix' => 'reimburse-quota'], function () {
            Route::get('/', [MasterQuotaReimburseController::class, 'list'])->name('master.reimburse-quota.list');
            Route::get('/detailData/{id}', [MasterQuotaReimburseController::class, 'detailData'])->name('master.reimburse-quota.detail.list');
            Route::post('/create', [MasterQuotaReimburseController::class, 'store'])->name('master.reimburse-quota.store');
            Route::put('/update/{id}', [MasterQuotaReimburseController::class, 'update'])->name('master.reimburse-quota.update');
            Route::get('/edit/{id}', [MasterQuotaReimburseController::class, 'edit'])->name('master.reimburse-quota.edit');
            Route::delete('/delete/{id}', [MasterQuotaReimburseController::class, 'destroy'])->name('master.reimburse-quota.destroy');
        });

        Route::group(['prefix' => 'family'], function () {
            Route::get('/{userId}', [FamilyController::class, 'list'])->name('master.family.list');
            Route::post('/create', [FamilyController::class, 'store'])->name('master.family.store');
            Route::put('/update/{id}', [FamilyController::class, 'update'])->name('master.family.update');
            Route::get('/edit/{id}', [FamilyController::class, 'edit'])->name('master.family.edit');
            Route::delete('/delete/{id}', [FamilyController::class, 'destroy'])->name('master.family.destroy');
        });

        Route::group(['prefix' => 'dropdown'], function () {
            Route::get('/', [DropdownMasterController::class, 'dropdown'])->name('master.dropdown');
        });
    });

    Route::group(['prefix' => 'master-pr'], function () {
        Route::group(['prefix' => 'dokument-type'], function () {
            Route::inertia('/',  'MasterPr/DokumentType/Index');
            Route::inertia('/create',  'MasterPr/DokumentType/Create');
            Route::inertia('/update/{id}',  'MasterPr/DokumentType/Update', [
                'id' => fn() => request()->route('id'),
            ]);
            Route::inertia('/detail/{id}',  'MasterPr/DokumentType/Detail', [
                'id' => fn() => request()->route('id'),
            ]);
        });

        Route::group(['prefix' => 'valuation-type'], function () {
            Route::inertia('/',  'MasterPr/ValuationType/Index');
            Route::inertia('/create',  'MasterPr/ValuationType/Create');
            Route::inertia('/update/{id}',  'MasterPr/ValuationType/Update', [
                'id' => fn() => request()->route('id'),
            ]);
        });

        Route::group(['prefix' => 'purchasing-group'], function () {
            Route::inertia('/',  'MasterPr/PurchasingGroup/Index');
            Route::inertia('/create',  'MasterPr/PurchasingGroup/Create');
            Route::inertia('/update/{id}',  'MasterPr/PurchasingGroup/Update', [
                'id' => fn() => request()->route('id'),
            ]);
        });

        Route::group(['prefix' => 'account-assignment-category'], function () {
            Route::inertia('/',  'MasterPr/AccountAssignmentCategory/Index');
            Route::inertia('/create',  'MasterPr/AccountAssignmentCategory/Create');
            Route::inertia('/update/{id}',  'MasterPr/AccountAssignmentCategory/Update', [
                'id' => fn() => request()->route('id'),
            ]);
        });


        Route::group(['prefix' => 'item-category'], function () {
            Route::inertia('/',  'MasterPr/ItemCategory/Index');
            Route::inertia('/create',  'MasterPr/ItemCategory/Create');
            Route::inertia('/update/{id}',  'MasterPr/ItemCategory/Update', [
                'id' => fn() => request()->route('id'),
            ]);
        });


        Route::group(['prefix' => 'storage-location'], function () {
            Route::inertia('/',  'MasterPr/StorageLocation/Index');
            Route::inertia('/create',  'MasterPr/StorageLocation/Create');
            Route::inertia('/update/{id}',  'MasterPr/StorageLocation/Update', [
                'id' => fn() => request()->route('id'),
            ]);
        });

        Route::group(['prefix' => 'material-group'], function () {
            Route::inertia('/',  'MasterPr/MaterialGroup/Index');
            Route::inertia('/create',  'MasterPr/MaterialGroup/Create');
            Route::inertia('/update/{id}',  'MasterPr/MaterialGroup/Update', [
                'id' => fn() => request()->route('id'),
            ]);
        });

        Route::group(['prefix' => 'uom'], function () {
            Route::inertia('/',  'MasterPr/Uom/Index');
            Route::inertia('/create',  'MasterPr/Uom/Create');
            Route::inertia('/update/{id}',  'MasterPr/Uom/Update', [
                'id' => fn() => request()->route('id'),
            ]);
        });
        Route::group(['prefix' => 'pajak'], function () {
            Route::inertia('/',  'MasterPr/Pajak/Index');
            Route::inertia('/create',  'MasterPr/Pajak/Create');
            Route::inertia('/update/{id}',  'MasterPr/Pajak/Update', [
                'id' => fn() => request()->route('id'),
            ]);
        });
    });
    Route::group(['prefix' => 'api/master-pr', 'middleware' => 'auth'], function () {
        Route::group(['prefix' => 'dokument-type'], function () {
            Route::get('/list', [DokumentTypeController::class, 'index'])->name('master.dokument-type.index');
            Route::post('/create', [DokumentTypeController::class, 'store'])->name('master.dokument-type.store');
            Route::post('/update/{id}', [DokumentTypeController::class, 'update'])->name('master.dokument-type.update');
            Route::get('/detail/{id}', [DokumentTypeController::class, 'show'])->name('master.dokument-type.show');
            Route::delete('/delete/{id}', [DokumentTypeController::class, 'destroy'])->name('master.dokument-type.destroy');
        });
        Route::group(['prefix' => 'valuation-type'], function () {
            Route::get('/list', [ValuationTypeController::class, 'index'])->name('master.valuation-type.index');
            Route::post('/create', [ValuationTypeController::class, 'store'])->name('master.valuation-type.store');
            Route::post('/update/{id}', [ValuationTypeController::class, 'update'])->name('master.valuation-type.update');
            Route::get('/detail/{id}', [ValuationTypeController::class, 'show'])->name('master.valuation-type.show');
            Route::delete('/delete/{id}', [ValuationTypeController::class, 'destroy'])->name('master.valuation-type.destroy');
        });
        Route::group(['prefix' => 'purchasing-group'], function () {
            Route::get('/list', [PurchasingGroupController::class, 'index'])->name('master.purchasing-group.index');
            Route::post('/create', [PurchasingGroupController::class, 'store'])->name('master.purchasing-group.store');
            Route::post('/update/{id}', [PurchasingGroupController::class, 'update'])->name('master.purchasing-group.update');
            Route::get('/detail/{id}', [PurchasingGroupController::class, 'show'])->name('master.purchasing-group.show');
            Route::delete('/delete/{id}', [PurchasingGroupController::class, 'destroy'])->name('master.purchasing-group.destroy');
        });
        Route::group(['prefix' => 'account-assignment-category'], function () {
            Route::get('/list', [AccountAssignmentCategoryController::class, 'index'])->name('master.account-assignment-category.index');
            Route::post('/create', [AccountAssignmentCategoryController::class, 'store'])->name('master.account-assignment-category.store');
            Route::post('/update/{id}', [AccountAssignmentCategoryController::class, 'update'])->name('master.account-assignment-category.update');
            Route::get('/detail/{id}', [AccountAssignmentCategoryController::class, 'show'])->name('master.account-assignment-category.show');
            Route::delete('/delete/{id}', [AccountAssignmentCategoryController::class, 'destroy'])->name('master.account-assignment-category.destroy');
        });
        Route::group(['prefix' => 'item-category'], function () {
            Route::get('/list', [ItemCategoryController::class, 'index'])->name('master.item-category.index');
            Route::post('/create', [ItemCategoryController::class, 'store'])->name('master.item-category.store');
            Route::post('/update/{id}', [ItemCategoryController::class, 'update'])->name('master.item-category.update');
            Route::get('/detail/{id}', [ItemCategoryController::class, 'show'])->name('master.item-category.show');
            Route::delete('/delete/{id}', [ItemCategoryController::class, 'destroy'])->name('master.item-category.destroy');
        });
        Route::group(['prefix' => 'storage-location'], function () {
            Route::get('/list', [StorageLocationController::class, 'index'])->name('master.storage-location.index');
            Route::post('/create', [StorageLocationController::class, 'store'])->name('master.storage-location.store');
            Route::post('/update/{id}', [StorageLocationController::class, 'update'])->name('master.storage-location.update');
            Route::get('/detail/{id}', [StorageLocationController::class, 'show'])->name('master.storage-location.show');
            Route::delete('/delete/{id}', [StorageLocationController::class, 'destroy'])->name('master.storage-location.destroy');
        });

        Route::group(['prefix' => 'material-group'], function () {
            Route::get('/list', [MaterialGroupController::class, 'index'])->name('master.material-group.index');
            Route::post('/create', [MaterialGroupController::class, 'store'])->name('master.material-group.store');
            Route::post('/update/{id}', [MaterialGroupController::class, 'update'])->name('master.material-group.update');
            Route::get('/detail/{id}', [MaterialGroupController::class, 'show'])->name('master.material-group.show');
            Route::delete('/delete/{id}', [MaterialGroupController::class, 'destroy'])->name('master.material-group.destroy');
        });

        Route::group(['prefix' => 'uom'], function () {
            Route::get('/list', [UomController::class, 'index'])->name('master.uom.index');
            Route::post('/create', [UomController::class, 'store'])->name('master.uom.store');
            Route::post('/update/{id}', [UomController::class, 'update'])->name('master.uom.update');
            Route::get('/detail/{id}', [UomController::class, 'show'])->name('master.uom.show');
            Route::delete('/delete/{id}', [UomController::class, 'destroy'])->name('master.uom.destroy');
        });
        Route::group(['prefix' => 'pajak'], function () {
            Route::get('/list', [PajakController::class, 'index'])->name('master.pajak.index');
            Route::post('/create', [PajakController::class, 'store'])->name('master.pajak.store');
            Route::post('/update/{id}', [PajakController::class, 'update'])->name('master.pajak.update');
            Route::get('/detail/{id}', [PajakController::class, 'show'])->name('master.pajak.show');
            Route::delete('/delete/{id}', [PajakController::class, 'destroy'])->name('master.pajak.destroy');
        });

        Route::group(['prefix' => 'data-dropdown'], function () {
            Route::get('/list', [DataDropdownController::class, 'index'])->name('master.data-dropdown.index');
            Route::post('/create', [DataDropdownController::class, 'store'])->name('master.data-dropdown.store');
            Route::post('/update/{id}', [DataDropdownController::class, 'update'])->name('master.data-dropdown.update');
            Route::get('/detail/{id}/{type}', [DataDropdownController::class, 'show'])->name('master.data-dropdown.show');
            Route::delete('/delete/{id}', [DataDropdownController::class, 'destroy'])->name('master.data-dropdown.destroy');
        });
    });
});
