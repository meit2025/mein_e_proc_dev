<?php

use App\Http\Controllers\FamilyController;
use Illuminate\Support\Facades\Route;
use Modules\Auth\Http\Controllers\AuthController;
use Modules\Reimbuse\Http\Controllers\ReimbuseController;

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

// Route::group(['middleware' => 'auth'], function () {
Route::group(['prefix' => 'reimburse'], function () {
    Route::get('/', [ReimbuseController::class, 'index'])->name('reimburse.index');
    Route::get('/edit/{id}', [ReimbuseController::class, 'edit'])->name('reimburse.edit');

    Route::get('/get-data-family/{user_id}', [ReimbuseController::class, 'getFamilyDataAPI'])->name('reimbuse.get-data-family');

    Route::inertia('/detail/{id}',  'Reimburse/Detail', [
        'id' => fn() => request()->route('id'),
    ]);
    Route::get('/print/{id}', [ReimbuseController::class, 'print'])->name('reimburse.print');
    Route::get('/data-limit-and-balance', [ReimbuseController::class, 'getDataLimitAndBalance'])->name('reimburse.data-limit-balance');
});


Route::group(['prefix' => 'api/reimburse'], function () {
    Route::get('/', [ReimbuseController::class, 'list'])->name('api.reimburse.list');
    Route::PUT('/update/{id}', [ReimbuseController::class, 'update'])->name('api.reimburse.update');
    Route::POST('/store', [ReimbuseController::class, 'store'])->name('api.reimburse.store');
    Route::DELETE('/destory/{id}', [ReimbuseController::class, 'destroy'])->name('api.reimburse.destroy');

    Route::get('/detail/{id}', [ReimbuseController::class, 'detailAPI'])->name('reimburse.detail');
    Route::get('/get-list-master-reimburse-type', [ReimbuseController::class, 'getListMasterReimburseTypeAPI'])->name('reimburse.get-list-master-reimburse-type');
    Route::get('/get-employee-reimburse', [ReimbuseController::class, 'dropdownEmployee'])->name('reimburse.get-reimburse-employee');
    Route::get('/get-family-reimburse', [ReimbuseController::class, 'dropdownFamily'])->name('reimburse.get-reimburse-family');

    // getPeriodAPI
});

// });

Route::get('/family/show/{employee}', [FamilyController::class, 'show']);
