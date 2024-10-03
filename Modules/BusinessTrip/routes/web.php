<?php

use Illuminate\Support\Facades\Route;
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


Route::get('bussiness-trip', [BusinessTripController::class, 'index'])->name('bussiness-trip.index');
