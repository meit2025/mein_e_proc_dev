<?php

use Illuminate\Support\Facades\Route;
use Modules\BusinessTrip\Http\Controllers\AllowanceCategoryController;
use Modules\BusinessTrip\Http\Controllers\AllowanceItemController;
use Modules\BusinessTrip\Http\Controllers\BusinessTripController;
use Modules\BusinessTrip\Http\Controllers\PurposeTypeController;
use Modules\BusinessTrip\Models\AllowanceItem;

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


Route::get('/business-trip', [BusinessTripController::class, 'index'])->name('bussiness-trip.index');
Route::get('/allowance-category', [AllowanceCategoryController::class, 'index'])->name('allowance-category.index');



Route::prefix('business-trip')->group(function () {});
Route::group(['prefix' => 'business-trip'], function () {
    Route::get('/business-trip', [BusinessTripController::class, 'index'])->name('bussiness-trip.index');
    Route::get('/allowance-category', [AllowanceCategoryController::class, 'index'])->name('allowance-category.index');
    Route::get('/allowance-item', [AllowanceItemController::class, 'index'])->name('allowance-item.index');
    Route::get('/purpose-type', [PurposeTypeController::class, 'index'])->name('purpose-type.index');

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
        Route::get('/detail/{id}', [PurposeTypeController::class, 'showAPI'])->name('allowance-category.detail');

        // Route::delete('/delete/{id}', [MasterMaterialController::class, 'destroy'])->name('master.master-material.destroy');


    });
});
