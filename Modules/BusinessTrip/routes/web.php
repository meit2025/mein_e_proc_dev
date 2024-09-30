<?php

use Illuminate\Support\Facades\Route;
use Modules\BusinessTrip\Http\Controllers\AllowanceCategoryController;
use Modules\BusinessTrip\Http\Controllers\BusinessTripController;

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



Route::prefix('business-trip')->group(function() {
  
});


Route::group(['prefix' => 'business-trip', 'middleware' => 'auth'], function () {
        Route::get('/business-trip', [BusinessTripController::class, 'index'])->name('bussiness-trip.index');
        Route::get('/allowance-category', [AllowanceCategoryController::class, 'index'])->name('allowance-category.index');
});
Route::group(['prefix' => 'api/', 'middleware' => 'auth'], function () {
    Route::group(['prefix' => 'allowance-category'], function () {
        Route::get('/list', [AllowanceCategoryController::class, 'listAPI'])->name('allowance-category-list.index');
        Route::post('/create', [AllowanceCategoryController::class, 'storeAPI'])->name('allowance-category.store');
        // Route::post('/update/{id}', [MasterMaterialController::class, 'update'])->name('master.master-material.update');
        // Route::get('/detail/{id}', [MasterMaterialController::class, 'show'])->name('master.master-material.show');
        Route::get('/detail/{id}', [AllowanceCategoryController::class, 'showAPI'])->name('allowance-category.detail');

        // Route::delete('/delete/{id}', [MasterMaterialController::class, 'destroy'])->name('master.master-material.destroy');
    });
  
});