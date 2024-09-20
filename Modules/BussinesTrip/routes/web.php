<?php

use Illuminate\Support\Facades\Route;
use Modules\BussinesTrip\Http\Controllers\BussinesTripController;

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
//     Route::resource('bussinestrip', BussinesTripController::class)->names('bussinestrip');
// });


Route::get('/bussines-trip', [BussinesTripController::class,'index'])->name('bussiness-trip-list');