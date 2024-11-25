<?php

use App\Http\Middleware\PermissionMiddleware;
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
use Modules\Master\Http\Controllers\MasterDepartmentController;
use Modules\Master\Http\Controllers\MasterDivisionController;
use Modules\Master\Http\Controllers\MasterMaterialController;
use Modules\Master\Http\Controllers\MaterialGroupController;
use Modules\Master\Http\Controllers\MasterPeriodReimburseController;
use Modules\Master\Http\Controllers\MasterPositionController;
use Modules\Master\Http\Controllers\MasterQuotaReimburseController;
use Modules\Master\Http\Controllers\MasterTrackingNumberController;
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
        Route::group(['prefix' => 'master-material',], function () {
            Route::inertia('/',  'Master/MasterMaterial/Index')->middleware(PermissionMiddleware::class . ':master sap material view');
        });
        Route::group(['prefix' => 'asset'], function () {
            Route::inertia('/',  'Master/MasterAsset/Index')->middleware(PermissionMiddleware::class . ':master sap asset view');
        });
        Route::group(['prefix' => 'bank-key'], function () {
            Route::inertia('/',  'Master/MasterBankKey/Index')->middleware(PermissionMiddleware::class . ':master sap bank key view');
        });
        Route::group(['prefix' => 'cost-center'], function () {
            Route::inertia('/',  'Master/MasterCostCenter/Index')->middleware(PermissionMiddleware::class . ':master sap cost center view');
        });
        Route::group(['prefix' => 'order'], function () {
            Route::inertia('/',  'Master/MasterOrder/Index')->middleware(PermissionMiddleware::class . ':master sap internal order view');
        });
        Route::group(['prefix' => 'recon'], function () {
            Route::inertia('/',  'Master/MasterRecon/Index')->middleware(PermissionMiddleware::class . ':master sap recon account view');
        });
        Route::group(['prefix' => 'business-partner'], function () {
            Route::inertia('/',  'Master/MasterBusinessPartner/Index')->middleware(PermissionMiddleware::class . ':master sap business partner view');
        });
        Route::group(['prefix' => 'reimburse-period'], function () {
            Route::inertia('/',  'Master/MasterReimbursePeriod/Index')->middleware(PermissionMiddleware::class . ':master reimburse period view,master reimburse period create,master reimburse period update,master reimburse period delete');
        });
        Route::get('reimburse-type/', [MasterTypeReimburseController::class, 'index'])->name('type.master.reimburse-type.index')->middleware(PermissionMiddleware::class . ':master reimburse type view,master reimburse type create,master reimburse type update,master reimburse type delete');
        Route::get('reimburse-quota/', [MasterQuotaReimburseController::class, 'index'])->name('master.reimburse-quota.index')->middleware(PermissionMiddleware::class . ':master reimburse quota view,master reimburse quota create,master reimburse quota update,master reimburse quota delete');
        Route::get('reimburse-quota/detail/{id}', [MasterQuotaReimburseController::class, 'detail'])->name('master.reimburse-quota.detail')->middleware(PermissionMiddleware::class . ':master reimburse quota view');
        Route::get('family/', [FamilyController::class, 'index'])->name('master.family.index');

        Route::group(['prefix' => 'position', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('Master/MasterPosition/Index');
            })->middleware(PermissionMiddleware::class . ':position view');

            Route::get('/create', function () {
                return inertia('Master/MasterPosition/Create');
            })->middleware(PermissionMiddleware::class . ':position create');

            Route::get('/update/{id}', function ($id) {
                return inertia('Master/MasterPosition/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':position update');
        });
        Route::group(['prefix' => 'division', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('Master/MasterDivision/Index');
            })->middleware(PermissionMiddleware::class . ':division view');

            Route::get('/create', function () {
                return inertia('Master/MasterDivision/Create');
            })->middleware(PermissionMiddleware::class . ':division create');

            Route::get('/update/{id}', function ($id) {
                return inertia('Master/MasterDivision/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':division update');
        });
        Route::group(['prefix' => 'department', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('Master/MasterDepartment/Index');
            })->middleware(PermissionMiddleware::class . ':department view');

            Route::get('/create', function () {
                return inertia('Master/MasterDepartment/Create');
            })->middleware(PermissionMiddleware::class . ':department create');

            Route::get('/update/{id}', function ($id) {
                return inertia('Master/MasterDepartment/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':department update');
        });
        Route::group(['prefix' => 'tracking-number', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('Master/MasterTrackingNumber/Index');
            })->middleware(PermissionMiddleware::class . ':tracking number view');

            Route::get('/create', function () {
                return inertia('Master/MasterTrackingNumber/Create');
            })->middleware(PermissionMiddleware::class . ':tracking number create');

            Route::get('/update/{id}', function ($id) {
                return inertia('Master/MasterTrackingNumber/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':tracking number update');
        });
    });

    Route::group(['prefix' => 'api/master', 'middleware' => 'auth'], function () {
        Route::group(['prefix' => 'master-material'], function () {
            Route::get('/list', [MasterMaterialController::class, 'index'])->name('master.master-material.index')->middleware(PermissionMiddleware::class . ':master sap material view');
            Route::post('/create', [MasterMaterialController::class, 'store'])->name('master.master-material.store')->middleware(PermissionMiddleware::class . ':master sap material create');
            Route::post('/update/{id}', [MasterMaterialController::class, 'update'])->name('master.master-material.update')->middleware(PermissionMiddleware::class . ':master sap material update');
            Route::get('/detail/{id}', [MasterMaterialController::class, 'show'])->name('master.master-material.show')->middleware(PermissionMiddleware::class . ':master sap material view');
            Route::delete('/delete/{id}', [MasterMaterialController::class, 'destroy'])->name('master.master-material.destroy')->middleware(PermissionMiddleware::class . ':master sap material delete');


            route::get("/get-list-material-by-material-group/{material_group}", [MasterMaterialController::class, 'getListMaterialByMaterialGroupAPI'])->name('master.get-master-material-by-material-group');
            Route::get('/get-dropdown-master-material-number', [MasterMaterialController::class, 'getListMasterMaterialNumberAPI'])->name('dropdown-master-material-number');
            Route::get('/get-dropdown-master-material-number/by-material-group/{material_group}', [MasterMaterialController::class, 'getListMasterMaterialNumberByMaterialGroupAPI'])->name('dropdown-master-material-number-by-material-group');
            Route::get('/get-dropdown-master-material-group', [MasterMaterialController::class, 'getListMasterMaterialGroupAPI'])->name('dropdown-master-material-group');
        });
        Route::group(['prefix' => 'asset'], function () {
            Route::get('/list', [AssetController::class, 'index'])->name('master.asset.index')->middleware(PermissionMiddleware::class . ':master sap asset view');
            Route::post('/create', [AssetController::class, 'store'])->name('master.asset.store')->middleware(PermissionMiddleware::class . ':master sap asset create');
            Route::post('/update/{id}', [AssetController::class, 'update'])->name('master.asset.update')->middleware(PermissionMiddleware::class . ':master sap asset update');
            Route::get('/detail/{id}', [AssetController::class, 'show'])->name('master.asset.show')->middleware(PermissionMiddleware::class . ':master sap asset view');
            Route::delete('/delete/{id}', [AssetController::class, 'destroy'])->name('master.asset.destroy')->middleware(PermissionMiddleware::class . ':master sap asset delete');
        });
        Route::group(['prefix' => 'bank-key'], function () {
            Route::get('/list', [BankKeyController::class, 'index'])->name('master.bank-key.index')->middleware(PermissionMiddleware::class . ':master sap bank key view');
            Route::post('/create', [BankKeyController::class, 'store'])->name('master.bank-key.store')->middleware(PermissionMiddleware::class . ':master sap bank key create');
            Route::post('/update/{id}', [BankKeyController::class, 'update'])->name('master.bank-key.update')->middleware(PermissionMiddleware::class . ':master sap bank key update');
            Route::get('/detail/{id}', [BankKeyController::class, 'show'])->name('master.bank-key.show')->middleware(PermissionMiddleware::class . ':master sap bank key view');
            Route::delete('/delete/{id}', [BankKeyController::class, 'destroy'])->name('master.bank-key.destroy')->middleware(PermissionMiddleware::class . ':master sap bank key delete');
        });
        Route::group(['prefix' => 'cost-center'], function () {
            Route::get('/list', [CostCenterController::class, 'index'])->name('master.cost-center.index')->middleware(PermissionMiddleware::class . ':master sap cost center view');
            Route::post('/create', [CostCenterController::class, 'store'])->name('master.cost-center.store')->middleware(PermissionMiddleware::class . ':master sap cost center create');
            Route::post('/update/{id}', [CostCenterController::class, 'update'])->name('master.cost-center.update')->middleware(PermissionMiddleware::class . ':master sap cost center update');
            Route::get('/detail/{id}', [CostCenterController::class, 'show'])->name('master.cost-center.show')->middleware(PermissionMiddleware::class . ':master sap cost center view');
            Route::delete('/delete/{id}', [CostCenterController::class, 'destroy'])->name('master.cost-center.destroy')->middleware(PermissionMiddleware::class . ':master sap cost center delete');
        });
        Route::group(['prefix' => 'order'], function () {
            Route::get('/list', [OrderController::class, 'index'])->name('master.order.index')->middleware(PermissionMiddleware::class . ':master sap internal order view');
            Route::post('/create', [OrderController::class, 'store'])->name('master.order.store')->middleware(PermissionMiddleware::class . ':master sap internal order create');
            Route::post('/update/{id}', [OrderController::class, 'update'])->name('master.order.update')->middleware(PermissionMiddleware::class . ':master sap internal order update');
            Route::get('/detail/{id}', [OrderController::class, 'show'])->name('master.order.show')->middleware(PermissionMiddleware::class . ':master sap internal order view');
            Route::delete('/delete/{id}', [OrderController::class, 'destroy'])->name('master.order.destroy')->middleware(PermissionMiddleware::class . ':master sap internal order delete');
        });
        Route::group(['prefix' => 'recon'], function () {
            Route::get('/list', [ReconController::class, 'index'])->name('master.recon.index')->middleware(PermissionMiddleware::class . ':master sap recon account view');
            Route::post('/create', [ReconController::class, 'store'])->name('master.recon.store')->middleware(PermissionMiddleware::class . ':master sap recon account create');
            Route::post('/update/{id}', [ReconController::class, 'update'])->name('master.recon.update')->middleware(PermissionMiddleware::class . ':master sap recon account update');
            Route::get('/detail/{id}', [ReconController::class, 'show'])->name('master.recon.show')->middleware(PermissionMiddleware::class . ':master sap recon account view');
            Route::delete('/delete/{id}', [ReconController::class, 'destroy'])->name('master.recon.destroy')->middleware(PermissionMiddleware::class . ':master sap recon account delete');
        });

        Route::group(['prefix' => 'business-parner'], function () {
            Route::get('/list', [MasterBusinessPartnerController::class, 'index'])->name('master.business.index')->middleware(PermissionMiddleware::class . ':master sap business partner view');
            Route::post('/create', [MasterBusinessPartnerController::class, 'store'])->name('master.business.store')->middleware(PermissionMiddleware::class . ':master sap business partner create');
            Route::post('/update/{id}', [MasterBusinessPartnerController::class, 'update'])->name('master.business.update')->middleware(PermissionMiddleware::class . ':master sap business partner update');
            Route::get('/detail/{id}', [MasterBusinessPartnerController::class, 'show'])->name('master.business.show')->middleware(PermissionMiddleware::class . ':master sap business partner view');
            Route::delete('/delete/{id}', [MasterBusinessPartnerController::class, 'destroy'])->name('master.business.destroy')->middleware(PermissionMiddleware::class . ':master sap business partner delete');
        });

        Route::group(['prefix' => 'reimburse-type'], function () {
            Route::get('/', [MasterTypeReimburseController::class, 'list'])->name('master.reimburse-type.list')->middleware(PermissionMiddleware::class . ':master reimburse type view');
            Route::get('/listUserGrade/{id}', [MasterTypeReimburseController::class, 'listGradeUsers'])->name('master.listUserGrade');
            Route::post('/create', [MasterTypeReimburseController::class, 'store'])->name('master.reimburse-type.store')->middleware(PermissionMiddleware::class . ':master reimburse type create');
            Route::put('/update/{id}', [MasterTypeReimburseController::class, 'update'])->name('master.reimburse-type.update')->middleware(PermissionMiddleware::class . ':master reimburse type update');
            Route::get('/edit/{id}', [MasterTypeReimburseController::class, 'edit'])->name('master.reimburse-type.edit')->middleware(PermissionMiddleware::class . ':master reimburse type update');
            Route::delete('/delete/{id}', [MasterTypeReimburseController::class, 'destroy'])->name('master.reimburse-type.destroy')->middleware(PermissionMiddleware::class . ':master reimburse type delete');
        });

        Route::group(['prefix' => 'reimburse-period'], function () {
            Route::get('/list', [MasterPeriodReimburseController::class, 'index'])->name('master.reimburse-period.index')->middleware(PermissionMiddleware::class . ':master reimburse period view');
            Route::post('/create', [MasterPeriodReimburseController::class, 'store'])->name('master.reimburse-period.store')->middleware(PermissionMiddleware::class . ':master reimburse period create');
            Route::put('/update/{id}', [MasterPeriodReimburseController::class, 'update'])->name('master.reimburse-period.update')->middleware(PermissionMiddleware::class . ':master reimburse period update');
            Route::get('/edit/{id}', [MasterPeriodReimburseController::class, 'edit'])->name('master.reimburse-period.edit')->middleware(PermissionMiddleware::class . ':master reimburse period update');
            Route::delete('/delete/{id}', [MasterPeriodReimburseController::class, 'destroy'])->name('master.reimburse-period.destroy')->middleware(PermissionMiddleware::class . ':master reimburse period delete');
        });

        Route::group(['prefix' => 'reimburse-quota'], function () {
            Route::get('/', [MasterQuotaReimburseController::class, 'list'])->name('master.reimburse-quota.list')->middleware(PermissionMiddleware::class . ':master reimburse quota view');
            Route::get('/detailData/{id}', [MasterQuotaReimburseController::class, 'detailData'])->name('master.reimburse-quota.detail.list')->middleware(PermissionMiddleware::class . ':master reimburse quota view');
            Route::post('/create', [MasterQuotaReimburseController::class, 'store'])->name('master.reimburse-quota.store')->middleware(PermissionMiddleware::class . ':master reimburse quota create');
            Route::put('/update/{id}', [MasterQuotaReimburseController::class, 'update'])->name('master.reimburse-quota.update')->middleware(PermissionMiddleware::class . ':master reimburse quota update');
            Route::get('/edit/{id}', [MasterQuotaReimburseController::class, 'edit'])->name('master.reimburse-quota.edit')->middleware(PermissionMiddleware::class . ':master reimburse quota update');
            Route::delete('/delete/{id}', [MasterQuotaReimburseController::class, 'destroy'])->name('master.reimburse-quota.destroy')->middleware(PermissionMiddleware::class . ':master reimburse quota delete');
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
            Route::get('/tabel', [DropdownMasterController::class, 'show_tabel'])->name('master.show_tabel');
        });

        Route::group(['prefix' => 'position'], function () {
            Route::get('/list', [MasterPositionController::class, 'index'])->name('master.position.index')->middleware(PermissionMiddleware::class . ':position view');
            Route::post('/create', [MasterPositionController::class, 'store'])->name('master.position.store')->middleware(PermissionMiddleware::class . ':position create');
            Route::post('/update/{id}', [MasterPositionController::class, 'update'])->name('master.position.update')->middleware(PermissionMiddleware::class . ':position update');
            Route::get('/detail/{id}', [MasterPositionController::class, 'show'])->name('master.position.show')->middleware(PermissionMiddleware::class . ':position view');
            Route::delete('/delete/{id}', [MasterPositionController::class, 'destroy'])->name('master.position.destroy')->middleware(PermissionMiddleware::class . ':position delete');
        });

        Route::group(['prefix' => 'division'], function () {
            Route::get('/list', [MasterDivisionController::class, 'index'])->name('master.division.index')->middleware(PermissionMiddleware::class . ':division view');
            Route::post('/create', [MasterDivisionController::class, 'store'])->name('master.division.store')->middleware(PermissionMiddleware::class . ':division create');
            Route::post('/update/{id}', [MasterDivisionController::class, 'update'])->name('master.division.update')->middleware(PermissionMiddleware::class . ':division update');
            Route::get('/detail/{id}', [MasterDivisionController::class, 'show'])->name('master.division.show')->middleware(PermissionMiddleware::class . ':division view');
            Route::delete('/delete/{id}', [MasterDivisionController::class, 'destroy'])->name('master.division.destroy')->middleware(PermissionMiddleware::class . ':division delete');
        });

        Route::group(['prefix' => 'department'], function () {
            Route::get('/list', [MasterDepartmentController::class, 'index'])->name('master.department.index')->middleware(PermissionMiddleware::class . ':department view');
            Route::post('/create', [MasterDepartmentController::class, 'store'])->name('master.department.store')->middleware(PermissionMiddleware::class . ':department create');
            Route::post('/update/{id}', [MasterDepartmentController::class, 'update'])->name('master.department.update')->middleware(PermissionMiddleware::class . ':department update');
            Route::get('/detail/{id}', [MasterDepartmentController::class, 'show'])->name('master.department.show')->middleware(PermissionMiddleware::class . ':department view');
            Route::delete('/delete/{id}', [MasterDepartmentController::class, 'destroy'])->name('master.department.destroy')->middleware(PermissionMiddleware::class . ':department delete');
        });
        Route::group(['prefix' => 'tracking-number'], function () {
            Route::get('/list', [MasterTrackingNumberController::class, 'index'])->name('master.tracking-number.index')->middleware(PermissionMiddleware::class . ':tracking number view');
            Route::post('/create', [MasterTrackingNumberController::class, 'store'])->name('master.tracking-number.store')->middleware(PermissionMiddleware::class . ':tracking number create');
            Route::post('/update/{id}', [MasterTrackingNumberController::class, 'update'])->name('master.tracking-number.update')->middleware(PermissionMiddleware::class . ':tracking number update');
            Route::get('/detail/{id}', [MasterTrackingNumberController::class, 'show'])->name('master.tracking-number.show')->middleware(PermissionMiddleware::class . ':tracking number view');
            Route::delete('/delete/{id}', [MasterTrackingNumberController::class, 'destroy'])->name('master.tracking-number.destroy')->middleware(PermissionMiddleware::class . ':tracking number delete');
        });
    });




    Route::group(['prefix' => 'master-pr'], function () {

        Route::group(['prefix' => 'dokument-type', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('MasterPr/DokumentType/Index');
            })->middleware(PermissionMiddleware::class . ':master pr document type view');

            Route::get('/create', function () {
                return inertia('MasterPr/DokumentType/Create');
            })->middleware(PermissionMiddleware::class . ':master pr document type create');

            Route::get('/update/{id}', function ($id) {
                return inertia('MasterPr/DokumentType/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':master pr document type update');
        });

        // Valuation Type Routes
        Route::group(['prefix' => 'valuation-type', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('MasterPr/ValuationType/Index');
            })->middleware(PermissionMiddleware::class . ':master pr valuation type view');

            Route::get('/create', function () {
                return inertia('MasterPr/ValuationType/Create');
            })->middleware(PermissionMiddleware::class . ':master pr valuation type create');

            Route::get('/update/{id}', function ($id) {
                return inertia('MasterPr/ValuationType/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':master pr valuation type update');
        });

        // Purchasing Group Routes
        Route::group(['prefix' => 'purchasing-group', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('MasterPr/PurchasingGroup/Index');
            })->middleware(PermissionMiddleware::class . ':master pr purchasing group view');

            Route::get('/create', function () {
                return inertia('MasterPr/PurchasingGroup/Create');
            })->middleware(PermissionMiddleware::class . ':master pr purchasing group create');

            Route::get('/update/{id}', function ($id) {
                return inertia('MasterPr/PurchasingGroup/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':master pr purchasing group update');
        });

        // Account Assignment Category Routes
        Route::group(['prefix' => 'account-assignment-category', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('MasterPr/AccountAssignmentCategory/Index');
            })->middleware(PermissionMiddleware::class . ':master pr account assignment category view');

            Route::get('/create', function () {
                return inertia('MasterPr/AccountAssignmentCategory/Create');
            })->middleware(PermissionMiddleware::class . ':master pr account assignment category create');

            Route::get('/update/{id}', function ($id) {
                return inertia('MasterPr/AccountAssignmentCategory/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':master pr account assignment category update');
        });

        // Item Category Routes
        Route::group(['prefix' => 'item-category', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('MasterPr/ItemCategory/Index');
            })->middleware(PermissionMiddleware::class . ':master pr item category view');

            Route::get('/create', function () {
                return inertia('MasterPr/ItemCategory/Create');
            })->middleware(PermissionMiddleware::class . ':master pr item category create');

            Route::get('/update/{id}', function ($id) {
                return inertia('MasterPr/ItemCategory/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':master pr item category update');
        });

        // Storage Location Routes
        Route::group(['prefix' => 'storage-location', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('MasterPr/StorageLocation/Index');
            })->middleware(PermissionMiddleware::class . ':master pr storage location view');

            Route::get('/create', function () {
                return inertia('MasterPr/StorageLocation/Create');
            })->middleware(PermissionMiddleware::class . ':master pr storage location create');

            Route::get('/update/{id}', function ($id) {
                return inertia('MasterPr/StorageLocation/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':master pr storage location update');
        });

        // Material Group Routes
        Route::group(['prefix' => 'material-group', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('MasterPr/MaterialGroup/Index');
            })->middleware(PermissionMiddleware::class . ':master pr material group view');

            Route::get('/create', function () {
                return inertia('MasterPr/MaterialGroup/Create');
            })->middleware(PermissionMiddleware::class . ':master pr material group create');

            Route::get('/update/{id}', function ($id) {
                return inertia('MasterPr/MaterialGroup/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':master pr material group update');
        });

        // UOM Routes
        Route::group(['prefix' => 'uom', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('MasterPr/Uom/Index');
            })->middleware(PermissionMiddleware::class . ':master pr uom view');

            Route::get('/create', function () {
                return inertia('MasterPr/Uom/Create');
            })->middleware(PermissionMiddleware::class . ':master pr uom create');

            Route::get('/update/{id}', function ($id) {
                return inertia('MasterPr/Uom/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':master pr uom update');
        });

        // Pajak Routes
        Route::group(['prefix' => 'pajak', 'middleware' => 'auth'], function () {
            Route::get('/', function () {
                return inertia('MasterPr/Pajak/Index');
            })->middleware(PermissionMiddleware::class . ':master pr tax view');

            Route::get('/create', function () {
                return inertia('MasterPr/Pajak/Create');
            })->middleware(PermissionMiddleware::class . ':master pr tax create');

            Route::get('/update/{id}', function ($id) {
                return inertia('MasterPr/Pajak/Update', ['id' => $id]);
            })->middleware(PermissionMiddleware::class . ':master pr tax update');
        });
    });


    Route::group(['prefix' => 'api/master-pr', 'middleware' => 'auth'], function () {
        // Dokument Type API
        Route::group(['prefix' => 'dokument-type'], function () {
            Route::get('/list', [DokumentTypeController::class, 'index'])->name('master.dokument-type.index')
                ->middleware(PermissionMiddleware::class . ':master pr document type view');
            Route::post('/create', [DokumentTypeController::class, 'store'])->name('master.dokument-type.store')
                ->middleware(PermissionMiddleware::class . ':master pr document type create');
            Route::post('/update/{id}', [DokumentTypeController::class, 'update'])->name('master.dokument-type.update')
                ->middleware(PermissionMiddleware::class . ':master pr document type update');
            Route::get('/detail/{id}', [DokumentTypeController::class, 'show'])->name('master.dokument-type.show')
                ->middleware(PermissionMiddleware::class . ':master pr document type view');
            Route::delete('/delete/{id}', [DokumentTypeController::class, 'destroy'])->name('master.dokument-type.destroy')
                ->middleware(PermissionMiddleware::class . ':master pr document type delete');
        });

        // Valuation Type API
        Route::group(['prefix' => 'valuation-type'], function () {
            Route::get('/list', [ValuationTypeController::class, 'index'])->name('master.valuation-type.index')
                ->middleware(PermissionMiddleware::class . ':master pr valuation type view');
            Route::post('/create', [ValuationTypeController::class, 'store'])->name('master.valuation-type.store')
                ->middleware(PermissionMiddleware::class . ':master pr valuation type create');
            Route::post('/update/{id}', [ValuationTypeController::class, 'update'])->name('master.valuation-type.update')
                ->middleware(PermissionMiddleware::class . ':master pr valuation type update');
            Route::get('/detail/{id}', [ValuationTypeController::class, 'show'])->name('master.valuation-type.show')
                ->middleware(PermissionMiddleware::class . ':master pr valuation type view');
            Route::delete('/delete/{id}', [ValuationTypeController::class, 'destroy'])->name('master.valuation-type.destroy')
                ->middleware(PermissionMiddleware::class . ':master pr valuation type delete');
        });

        // Purchasing Group API
        Route::group(['prefix' => 'purchasing-group'], function () {
            Route::get('/list', [PurchasingGroupController::class, 'index'])->name('master.purchasing-group.index')
                ->middleware(PermissionMiddleware::class . ':master pr purchasing group view');
            Route::post('/create', [PurchasingGroupController::class, 'store'])->name('master.purchasing-group.store')
                ->middleware(PermissionMiddleware::class . ':master pr purchasing group create');
            Route::post('/update/{id}', [PurchasingGroupController::class, 'update'])->name('master.purchasing-group.update')
                ->middleware(PermissionMiddleware::class . ':master pr purchasing group update');
            Route::get('/detail/{id}', [PurchasingGroupController::class, 'show'])->name('master.purchasing-group.show')
                ->middleware(PermissionMiddleware::class . ':master pr purchasing group view');
            Route::delete('/delete/{id}', [PurchasingGroupController::class, 'destroy'])->name('master.purchasing-group.destroy')
                ->middleware(PermissionMiddleware::class . ':master pr purchasing group delete');
        });

        // Account Assignment Category API
        Route::group(['prefix' => 'account-assignment-category'], function () {
            Route::get('/list', [AccountAssignmentCategoryController::class, 'index'])->name('master.account-assignment-category.index')
                ->middleware(PermissionMiddleware::class . ':master pr account assignment category view');
            Route::post('/create', [AccountAssignmentCategoryController::class, 'store'])->name('master.account-assignment-category.store')
                ->middleware(PermissionMiddleware::class . ':master pr account assignment category create');
            Route::post('/update/{id}', [AccountAssignmentCategoryController::class, 'update'])->name('master.account-assignment-category.update')
                ->middleware(PermissionMiddleware::class . ':master pr account assignment category update');
            Route::get('/detail/{id}', [AccountAssignmentCategoryController::class, 'show'])->name('master.account-assignment-category.show')
                ->middleware(PermissionMiddleware::class . ':master pr account assignment category view');
            Route::delete('/delete/{id}', [AccountAssignmentCategoryController::class, 'destroy'])->name('master.account-assignment-category.destroy')
                ->middleware(PermissionMiddleware::class . ':master pr account assignment category delete');
        });

        // Item Category API
        Route::group(['prefix' => 'item-category'], function () {
            Route::get('/list', [ItemCategoryController::class, 'index'])->name('master.item-category.index')
                ->middleware(PermissionMiddleware::class . ':master pr item category view');
            Route::post('/create', [ItemCategoryController::class, 'store'])->name('master.item-category.store')
                ->middleware(PermissionMiddleware::class . ':master pr item category create');
            Route::post('/update/{id}', [ItemCategoryController::class, 'update'])->name('master.item-category.update')
                ->middleware(PermissionMiddleware::class . ':master pr item category update');
            Route::get('/detail/{id}', [ItemCategoryController::class, 'show'])->name('master.item-category.show')
                ->middleware(PermissionMiddleware::class . ':master pr item category view');
            Route::delete('/delete/{id}', [ItemCategoryController::class, 'destroy'])->name('master.item-category.destroy')
                ->middleware(PermissionMiddleware::class . ':master pr item category delete');
        });

        // Storage Location API
        Route::group(['prefix' => 'storage-location'], function () {
            Route::get('/list', [StorageLocationController::class, 'index'])->name('master.storage-location.index')
                ->middleware(PermissionMiddleware::class . ':master pr storage location view');
            Route::post('/create', [StorageLocationController::class, 'store'])->name('master.storage-location.store')
                ->middleware(PermissionMiddleware::class . ':master pr storage location create');
            Route::post('/update/{id}', [StorageLocationController::class, 'update'])->name('master.storage-location.update')
                ->middleware(PermissionMiddleware::class . ':master pr storage location update');
            Route::get('/detail/{id}', [StorageLocationController::class, 'show'])->name('master.storage-location.show')
                ->middleware(PermissionMiddleware::class . ':master pr storage location view');
            Route::delete('/delete/{id}', [StorageLocationController::class, 'destroy'])->name('master.storage-location.destroy')
                ->middleware(PermissionMiddleware::class . ':master pr storage location delete');
        });

        // Material Group API
        Route::group(['prefix' => 'material-group'], function () {
            Route::get('/list', [MaterialGroupController::class, 'index'])->name('master.material-group.index')
                ->middleware(PermissionMiddleware::class . ':master pr material group view');
            Route::post('/create', [MaterialGroupController::class, 'store'])->name('master.material-group.store')
                ->middleware(PermissionMiddleware::class . ':master pr material group create');
            Route::post('/update/{id}', [MaterialGroupController::class, 'update'])->name('master.material-group.update')
                ->middleware(PermissionMiddleware::class . ':master pr material group update');
            Route::get('/detail/{id}', [MaterialGroupController::class, 'show'])->name('master.material-group.show')
                ->middleware(PermissionMiddleware::class . ':master pr material group view');
            Route::delete('/delete/{id}', [MaterialGroupController::class, 'destroy'])->name('master.material-group.destroy')
                ->middleware(PermissionMiddleware::class . ':master pr material group delete');
        });

        // UOM API
        Route::group(['prefix' => 'uom'], function () {
            Route::get('/list', [UomController::class, 'index'])->name('master.uom.index')
                ->middleware(PermissionMiddleware::class . ':master pr uom view');
            Route::post('/create', [UomController::class, 'store'])->name('master.uom.store')
                ->middleware(PermissionMiddleware::class . ':master pr uom create');
            Route::post('/update/{id}', [UomController::class, 'update'])->name('master.uom.update')
                ->middleware(PermissionMiddleware::class . ':master pr uom update');
            Route::get('/detail/{id}', [UomController::class, 'show'])->name('master.uom.show')
                ->middleware(PermissionMiddleware::class . ':master pr uom view');
            Route::delete('/delete/{id}', [UomController::class, 'destroy'])->name('master.uom.destroy')
                ->middleware(PermissionMiddleware::class . ':master pr uom delete');
        });

        // Pajak API
        Route::group(['prefix' => 'pajak'], function () {
            Route::get('/list', [PajakController::class, 'index'])->name('master.pajak.index')
                ->middleware(PermissionMiddleware::class . ':master pr tax view');
            Route::post('/create', [PajakController::class, 'store'])->name('master.pajak.store')
                ->middleware(PermissionMiddleware::class . ':master pr tax create');
            Route::post('/update/{id}', [PajakController::class, 'update'])->name('master.pajak.update')
                ->middleware(PermissionMiddleware::class . ':master pr tax update');
            Route::get('/detail/{id}', [PajakController::class, 'show'])->name('master.pajak.show')
                ->middleware(PermissionMiddleware::class . ':master pr tax view');
            Route::delete('/delete/{id}', [PajakController::class, 'destroy'])->name('master.pajak.destroy')
                ->middleware(PermissionMiddleware::class . ':master pr tax delete');
        });
    });



    // Route::group(['prefix' => 'master-pr'], function () {
    //     Route::group(['prefix' => 'dokument-type'], function () {
    //         Route::inertia('/',  'MasterPr/DokumentType/Index');
    //         Route::inertia('/create',  'MasterPr/DokumentType/Create');
    //         Route::inertia('/update/{id}',  'MasterPr/DokumentType/Update', [
    //             'id' => fn() => request()->route('id'),
    //         ]);
    //         Route::inertia('/detail/{id}',  'MasterPr/DokumentType/Detail', [
    //             'id' => fn() => request()->route('id'),
    //         ]);
    //     });

    //     Route::group(['prefix' => 'valuation-type'], function () {
    //         Route::inertia('/',  'MasterPr/ValuationType/Index');
    //         Route::inertia('/create',  'MasterPr/ValuationType/Create');
    //         Route::inertia('/update/{id}',  'MasterPr/ValuationType/Update', [
    //             'id' => fn() => request()->route('id'),
    //         ]);
    //     });

    //     Route::group(['prefix' => 'purchasing-group'], function () {
    //         Route::inertia('/',  'MasterPr/PurchasingGroup/Index');
    //         Route::inertia('/create',  'MasterPr/PurchasingGroup/Create');
    //         Route::inertia('/update/{id}',  'MasterPr/PurchasingGroup/Update', [
    //             'id' => fn() => request()->route('id'),
    //         ]);
    //     });

    //     Route::group(['prefix' => 'account-assignment-category'], function () {
    //         Route::inertia('/',  'MasterPr/AccountAssignmentCategory/Index');
    //         Route::inertia('/create',  'MasterPr/AccountAssignmentCategory/Create');
    //         Route::inertia('/update/{id}',  'MasterPr/AccountAssignmentCategory/Update', [
    //             'id' => fn() => request()->route('id'),
    //         ]);
    //     });


    //     Route::group(['prefix' => 'item-category'], function () {
    //         Route::inertia('/',  'MasterPr/ItemCategory/Index');
    //         Route::inertia('/create',  'MasterPr/ItemCategory/Create');
    //         Route::inertia('/update/{id}',  'MasterPr/ItemCategory/Update', [
    //             'id' => fn() => request()->route('id'),
    //         ]);
    //     });


    //     Route::group(['prefix' => 'storage-location'], function () {
    //         Route::inertia('/',  'MasterPr/StorageLocation/Index');
    //         Route::inertia('/create',  'MasterPr/StorageLocation/Create');
    //         Route::inertia('/update/{id}',  'MasterPr/StorageLocation/Update', [
    //             'id' => fn() => request()->route('id'),
    //         ]);
    //     });

    //     Route::group(['prefix' => 'material-group'], function () {
    //         Route::inertia('/',  'MasterPr/MaterialGroup/Index');
    //         Route::inertia('/create',  'MasterPr/MaterialGroup/Create');
    //         Route::inertia('/update/{id}',  'MasterPr/MaterialGroup/Update', [
    //             'id' => fn() => request()->route('id'),
    //         ]);
    //     });

    //     Route::group(['prefix' => 'uom'], function () {
    //         Route::inertia('/',  'MasterPr/Uom/Index');
    //         Route::inertia('/create',  'MasterPr/Uom/Create');
    //         Route::inertia('/update/{id}',  'MasterPr/Uom/Update', [
    //             'id' => fn() => request()->route('id'),
    //         ]);
    //     });
    //     Route::group(['prefix' => 'pajak'], function () {
    //         Route::inertia('/',  'MasterPr/Pajak/Index');
    //         Route::inertia('/create',  'MasterPr/Pajak/Create');
    //         Route::inertia('/update/{id}',  'MasterPr/Pajak/Update', [
    //             'id' => fn() => request()->route('id'),
    //         ]);
    //     });
    // });
    // Route::group(['prefix' => 'api/master-pr', 'middleware' => 'auth'], function () {
    //     Route::group(['prefix' => 'dokument-type'], function () {
    //         Route::get('/list', [DokumentTypeController::class, 'index'])->name('master.dokument-type.index');
    //         Route::post('/create', [DokumentTypeController::class, 'store'])->name('master.dokument-type.store');
    //         Route::post('/update/{id}', [DokumentTypeController::class, 'update'])->name('master.dokument-type.update');
    //         Route::get('/detail/{id}', [DokumentTypeController::class, 'show'])->name('master.dokument-type.show');
    //         Route::delete('/delete/{id}', [DokumentTypeController::class, 'destroy'])->name('master.dokument-type.destroy');
    //     });
    //     Route::group(['prefix' => 'valuation-type'], function () {
    //         Route::get('/list', [ValuationTypeController::class, 'index'])->name('master.valuation-type.index');
    //         Route::post('/create', [ValuationTypeController::class, 'store'])->name('master.valuation-type.store');
    //         Route::post('/update/{id}', [ValuationTypeController::class, 'update'])->name('master.valuation-type.update');
    //         Route::get('/detail/{id}', [ValuationTypeController::class, 'show'])->name('master.valuation-type.show');
    //         Route::delete('/delete/{id}', [ValuationTypeController::class, 'destroy'])->name('master.valuation-type.destroy');
    //     });
    //     Route::group(['prefix' => 'purchasing-group'], function () {
    //         Route::get('/list', [PurchasingGroupController::class, 'index'])->name('master.purchasing-group.index');
    //         Route::post('/create', [PurchasingGroupController::class, 'store'])->name('master.purchasing-group.store');
    //         Route::post('/update/{id}', [PurchasingGroupController::class, 'update'])->name('master.purchasing-group.update');
    //         Route::get('/detail/{id}', [PurchasingGroupController::class, 'show'])->name('master.purchasing-group.show');
    //         Route::delete('/delete/{id}', [PurchasingGroupController::class, 'destroy'])->name('master.purchasing-group.destroy');
    //     });
    //     Route::group(['prefix' => 'account-assignment-category'], function () {
    //         Route::get('/list', [AccountAssignmentCategoryController::class, 'index'])->name('master.account-assignment-category.index');
    //         Route::post('/create', [AccountAssignmentCategoryController::class, 'store'])->name('master.account-assignment-category.store');
    //         Route::post('/update/{id}', [AccountAssignmentCategoryController::class, 'update'])->name('master.account-assignment-category.update');
    //         Route::get('/detail/{id}', [AccountAssignmentCategoryController::class, 'show'])->name('master.account-assignment-category.show');
    //         Route::delete('/delete/{id}', [AccountAssignmentCategoryController::class, 'destroy'])->name('master.account-assignment-category.destroy');
    //     });
    //     Route::group(['prefix' => 'item-category'], function () {
    //         Route::get('/list', [ItemCategoryController::class, 'index'])->name('master.item-category.index');
    //         Route::post('/create', [ItemCategoryController::class, 'store'])->name('master.item-category.store');
    //         Route::post('/update/{id}', [ItemCategoryController::class, 'update'])->name('master.item-category.update');
    //         Route::get('/detail/{id}', [ItemCategoryController::class, 'show'])->name('master.item-category.show');
    //         Route::delete('/delete/{id}', [ItemCategoryController::class, 'destroy'])->name('master.item-category.destroy');
    //     });
    //     Route::group(['prefix' => 'storage-location'], function () {
    //         Route::get('/list', [StorageLocationController::class, 'index'])->name('master.storage-location.index');
    //         Route::post('/create', [StorageLocationController::class, 'store'])->name('master.storage-location.store');
    //         Route::post('/update/{id}', [StorageLocationController::class, 'update'])->name('master.storage-location.update');
    //         Route::get('/detail/{id}', [StorageLocationController::class, 'show'])->name('master.storage-location.show');
    //         Route::delete('/delete/{id}', [StorageLocationController::class, 'destroy'])->name('master.storage-location.destroy');
    //     });

    //     Route::group(['prefix' => 'material-group'], function () {
    //         Route::get('/list', [MaterialGroupController::class, 'index'])->name('master.material-group.index');
    //         Route::post('/create', [MaterialGroupController::class, 'store'])->name('master.material-group.store');
    //         Route::post('/update/{id}', [MaterialGroupController::class, 'update'])->name('master.material-group.update');
    //         Route::get('/detail/{id}', [MaterialGroupController::class, 'show'])->name('master.material-group.show');
    //         Route::delete('/delete/{id}', [MaterialGroupController::class, 'destroy'])->name('master.material-group.destroy');
    //     });

    //     Route::group(['prefix' => 'uom'], function () {
    //         Route::get('/list', [UomController::class, 'index'])->name('master.uom.index');
    //         Route::post('/create', [UomController::class, 'store'])->name('master.uom.store');
    //         Route::post('/update/{id}', [UomController::class, 'update'])->name('master.uom.update');
    //         Route::get('/detail/{id}', [UomController::class, 'show'])->name('master.uom.show');
    //         Route::delete('/delete/{id}', [UomController::class, 'destroy'])->name('master.uom.destroy');
    //     });
    //     Route::group(['prefix' => 'pajak'], function () {
    //         Route::get('/list', [PajakController::class, 'index'])->name('master.pajak.index');
    //         Route::post('/create', [PajakController::class, 'store'])->name('master.pajak.store');
    //         Route::post('/update/{id}', [PajakController::class, 'update'])->name('master.pajak.update');
    //         Route::get('/detail/{id}', [PajakController::class, 'show'])->name('master.pajak.show');
    //         Route::delete('/delete/{id}', [PajakController::class, 'destroy'])->name('master.pajak.destroy');
    //     });

    //     Route::group(['prefix' => 'data-dropdown'], function () {
    //         Route::get('/list', [DataDropdownController::class, 'index'])->name('master.data-dropdown.index');
    //         Route::post('/create', [DataDropdownController::class, 'store'])->name('master.data-dropdown.store');
    //         Route::post('/update/{id}', [DataDropdownController::class, 'update'])->name('master.data-dropdown.update');
    //         Route::get('/detail/{id}/{type}', [DataDropdownController::class, 'show'])->name('master.data-dropdown.show');
    //         Route::delete('/delete/{id}', [DataDropdownController::class, 'destroy'])->name('master.data-dropdown.destroy');
    //     });
    // });
});
