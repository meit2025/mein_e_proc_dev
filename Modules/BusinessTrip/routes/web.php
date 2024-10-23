<?php

use Illuminate\Support\Facades\Route;
use Modules\BusinessTrip\Http\Controllers\AllowanceCategoryController;
use Modules\BusinessTrip\Http\Controllers\AllowanceItemController;
use Modules\BusinessTrip\Http\Controllers\BusinessTripController;
use Modules\BusinessTrip\Http\Controllers\BusinessTripDeclarationController;
use Modules\BusinessTrip\Http\Controllers\BusinessTripGradeController;
use Modules\BusinessTrip\Http\Controllers\PurposeTypeController;
use Modules\BusinessTrip\Models\AllowanceItem;
use Modules\BusinessTrip\Models\BusinessTrip;

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
//     Route::resource('businesstrip', BusinessTripController::class)->names('businesstrip');
// });


// Route::get('/business-trip', [BusinessTripController::class, 'index'])->name('bussiness-trip.index');
// Route::get('/allowance-category', [AllowanceCategoryController::class, 'index'])->name('allowance-category.index');



Route::prefix('business-trip')->group(function () {});

Route::group(['prefix' => 'business-trip'], function () {
    Route::get('/', [BusinessTripController::class, 'index'])->name('bussiness-trip.index');
    Route::get('/business-trip-declaration', [BusinessTripDeclarationController::class, 'index'])->name('bussiness-trip-declaration.index');
    Route::get('/allowance-category', [AllowanceCategoryController::class, 'index'])->name('allowance-category.index');
    Route::get('/allowance-item', [AllowanceItemController::class, 'index'])->name('allowance-item.index');
    Route::get('/purpose-type', [PurposeTypeController::class, 'index'])->name('purpose-type.index');
    Route::get('/grade', [BusinessTripGradeController::class, 'index'])->name('business-grade.index');
});
Route::group(['prefix' => 'api/'], function () {
    Route::group(['prefix' => 'allowance-category'], function () {
        Route::get('/list', [AllowanceCategoryController::class, 'listAPI'])->name('allowance-category-list.index');
        Route::post('/create', [AllowanceCategoryController::class, 'storeAPI'])->name('allowance-category.store');
        // Route::post('/update/{id}', [MasterMaterialController::class, 'update'])->name('master.master-material.update');
        // Route::get('/detail/{id}', [MasterMaterialController::class, 'show'])->name('master.master-material.show');
        Route::get('/detail/{id}', [AllowanceCategoryController::class, 'showAPI'])->name('allowance-category.detail');

        // Route::delete('/delete/{id}', [MasterMaterialController::class, 'destroy'])->name('master.master-material.destroy');


    });


    Route::group(['prefix' => 'allowance-item'], function () {
        Route::get('/list', [AllowanceItemController::class, 'listAPI'])->name('allowance-item-list.index');
        Route::post('/create', [AllowanceItemController::class, 'storeAPI'])->name('allowance-item.store');
        // Route::post('/update/{id}', [MasterMaterialController::class, 'update'])->name('master.master-material.update');
        // Route::get('/detail/{id}', [MasterMaterialController::class, 'show'])->name('master.master-material.show');
        Route::get('/detail/{id}', [AllowanceCategoryController::class, 'showAPI'])->name('allowance-category.detail');

        // Route::delete('/delete/{id}', [MasterMaterialController::class, 'destroy'])->name('master.master-material.destroy');


    });

    Route::group(['prefix' => 'purpose-type'], function () {
        Route::get('/list', [PurposeTypeController::class, 'listAPI'])->name('purpose-type-list.index');
        Route::post('/create', [PurposeTypeController::class, 'storeAPI'])->name('purpose-type.store');
        // Route::post('/update/{id}', [MasterMaterialController::class, 'update'])->name('master.master-material.update');
        // Route::get('/detail/{id}', [MasterMaterialController::class, 'show'])->name('master.master-material.show');
        Route::get('/detail/{id}', [PurposeTypeController::class, 'detailAPI'])->name('purpose-type.detail');
        Route::get('/list-allowances-by-purpose-type/{id}/{userid}', [PurposeTypeController::class, 'getAllowanceByPurposeAPI'])->name('purpose-type.list-allowances');


        // Route::delete('/delete/{id}', [MasterMaterialController::class, 'destroy'])->name('master.master-material.destroy');


    });

    Route::group(['prefix' => 'business-trip'], function () {
        Route::get('/list', [BusinessTripController::class, 'listAPI'])->name('business-trip-list.index');
        Route::post('/create', [BusinessTripController::class, 'storeAPI'])->name('business-trip.store');
        // Route::post('/update/{id}', [MasterMaterialController::class, 'update'])->name('master.master-material.update');
        // Route::get('/detail/{id}', [MasterMaterialController::class, 'show'])->name('master.master-material.show');
        Route::get('/detail/{id}', [BusinessTripController::class, 'showAPI'])->name('business-trip.detail');

        // Route::delete('/delete/{id}', [MasterMaterialController::class, 'destroy'])->name('master.master-material.destroy');


    });

    Route::group(['prefix' => 'business-trip-declaration'], function () {
        Route::get('/list', [BusinessTripDeclarationController::class, 'listAPI'])->name('business-trip-declaration-list.index');
        Route::post('/create', [BusinessTripDeclarationController::class, 'storeAPI'])->name('business-trip-declaration.store');
        // Route::post('/update/{id}', [MasterMaterialController::class, 'update'])->name('master.master-material.update');
        // Route::get('/detail/{id}', [MasterMaterialController::class, 'show'])->name('master.master-material.show');
        Route::get('/detail/{id}', [BusinessTripDeclarationController::class, 'showAPI'])->name('allowance-category.detail');
    });

    Route::group(['prefix' => 'purpose-type-allowance'], function () {
        Route::get('/list', [BusinessTripController::class, 'listAPI'])->name('business-trip-list.index');
        Route::post('/create', [BusinessTripController::class, 'storeAPI'])->name('business-trip.store');
        // Route::post('/update/{id}', [MasterMaterialController::class, 'update'])->name('master.master-material.update');
        // Route::get('/detail/{id}', [MasterMaterialController::class, 'show'])->name('master.master-material.show');
        Route::get('/detail/{id}', [PurposeTypeController::class, 'detailAPI'])->name('allowance-category.detail');

        // Route::delete('/delete/{id}', [MasterMaterialController::class, 'destroy'])->name('master.master-material.destroy');


    });

    Route::group(['prefix' => 'business-grade'], function () {
        Route::get('/list', [BusinessTripGradeController::class, 'listAPI'])->name('business-grade-list.index');
        Route::post('/create', [BusinessTripGradeController::class, 'storeAPI'])->name('business-grade.store');
        // Route::post('/update/{id}', [MasterMaterialController::class, 'update'])->name('master.master-material.update');
        // Route::get('/detail/{id}', [MasterMaterialController::class, 'show'])->name('master.master-material.show');
        Route::get('/detail/{id}', [BusinessTripGradeController::class, 'detailAPI'])->name('business-grade.detail');

        // Route::delete('/delete/{id}', [MasterMaterialController::class, 'destroy'])->name('master.master-material.destroy');


    });
});
