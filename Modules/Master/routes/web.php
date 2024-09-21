<?php

use Illuminate\Support\Facades\Route;
use Modules\Master\Http\Controllers\MasterController;
use Modules\Master\Http\Controllers\MasterMaterialController;

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

Route::group([], function () {
    Route::resource('master', MasterController::class)->names('master');
    Route::inertia('master-material', 'Master/MasterMaterial/Index');
});
