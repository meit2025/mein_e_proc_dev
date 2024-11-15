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

    Route::get('/type/{type}', [ReimbuseController::class, 'getTypeData'])->name('reimburse.type');
    Route::post('/is_required', [ReimbuseController::class, 'is_required'])->name('reimburse.is_required');

    Route::get('/get-data-family/{user_id}', [ReimbuseController::class, 'getFamilyDataAPI'])->name('reimbuse.get-data-family');

    Route::inertia('/detail/{id}',  'Reimburse/Detail', [
        'id' => fn() => request()->route('id'),
    ]);
});
// });

Route::get('/family/show/{employee}', [FamilyController::class, 'show']);
