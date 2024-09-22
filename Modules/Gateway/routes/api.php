<?php

use Illuminate\Support\Facades\Route;
use Modules\Gateway\Http\Controllers\GatewayController;
use Modules\Gateway\Http\Controllers\SecretController;

/*
 *--------------------------------------------------------------------------
 * API Routes
 *--------------------------------------------------------------------------
 *
 * Here is where you can register API routes for your application. These
 * routes are loaded by the RouteServiceProvider within a group which
 * is assigned the "api" middleware group. Enjoy building your API!
 *
*/

// Route::group(['middleware' => 'auth'], function () {
//     Route::group(['prefix' => 'secret'], function () {
//         // Route to get all secret key employees
//         Route::get('/list', [SecretController::class, 'index'])->name('secret.employees.index');
//     });
// });
