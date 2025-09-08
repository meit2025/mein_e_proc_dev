<?php

use Illuminate\Support\Facades\Route;
use Modules\BusinessTrip\Http\Controllers\BusinessTripController;

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

Route::middleware(['auth:sanctum'])->prefix('business-trip')->group(function () {
    Route::apiResource('businesstrip', BusinessTripController::class)->names('businesstrip');
});
