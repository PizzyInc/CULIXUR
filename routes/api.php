<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [App\Http\Controllers\Api\AuthController::class, 'user'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->group(function () {
    // Member Routes
    Route::prefix('member')->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\Api\MemberDashboardController::class, 'index']);
        Route::get('/booking-details', [App\Http\Controllers\Api\MemberDashboardController::class, 'bookingDetails']);
        Route::post('/book', [App\Http\Controllers\Api\MemberDashboardController::class, 'storeBooking']);
    });

    // Chef Routes
    Route::prefix('chef')->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\Api\ChefDashboardController::class, 'index']);
        Route::post('/orders/{order}/update-status', [App\Http\Controllers\Api\ChefDashboardController::class, 'updateStatus']);
    });

    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\Api\AdminDashboardController::class, 'index']);
        Route::get('/users', [App\Http\Controllers\Api\AdminDashboardController::class, 'users']);
        Route::get('/bookings', [App\Http\Controllers\Api\AdminDashboardController::class, 'bookings']);
        Route::get('/menus', [App\Http\Controllers\Api\AdminDashboardController::class, 'menus']);
    });

    // Unified Notification Routes
    Route::get('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::get('/notifications/unread', [App\Http\Controllers\Api\NotificationController::class, 'unread']);
    Route::post('/notifications/mark-as-read', [App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
});
