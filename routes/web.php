<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\OrdersController as AdminOrders;
use App\Http\Controllers\Admin\MenusController as AdminMenus;
use App\Http\Controllers\Admin\UsersController as AdminUsers;
use App\Http\Controllers\Chef\DashboardController as ChefDashboard;
use App\Http\Controllers\Member\DashboardController as MemberDashboard;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    if (auth()->check()) {
        $user = auth()->user();
        return match($user->role) {
            'ADMIN' => redirect('/admin'),
            'CHEF' => redirect('/culinary'),
            'MEMBER' => redirect('/elite'),
            default => redirect('/login'),
        };
    }
    return view('landing');
});

// Public routes
Route::get('/member-login', [\App\Http\Controllers\Auth\MemberLoginController::class, 'create'])->name('member.login');
Route::post('/member-login', [\App\Http\Controllers\Auth\MemberLoginController::class, 'store']);
Route::get('/membership/apply', [\App\Http\Controllers\MembershipController::class, 'create'])->name('membership.apply.create');
Route::post('/membership/apply', [\App\Http\Controllers\MembershipController::class, 'apply'])->name('membership.apply');
Route::get('/chef-login', [\App\Http\Controllers\Auth\ChefLoginController::class, 'create'])->name('chef.login');
Route::post('/chef-login', [\App\Http\Controllers\Auth\ChefLoginController::class, 'store'])->name('chef.login.store');

Route::middleware(['auth'])->group(function () {
    // Admin Routes
    Route::prefix('admin')->middleware(['role:ADMIN'])->group(function () {
        Route::get('/', [AdminDashboard::class, 'index'])->name('admin.dashboard');
        Route::resource('orders', AdminOrders::class)->except(['create', 'store', 'edit', 'update', 'destroy']);
        Route::post('orders/{order}/assign-chef', [AdminOrders::class, 'assignChef'])->name('admin.orders.assign-chef');
        Route::post('orders/{order}/update-status', [AdminOrders::class, 'updateStatus'])->name('admin.orders.update-status');
        Route::resource('menus', AdminMenus::class);
        Route::resource('users', AdminUsers::class);
        Route::get('applications', [\App\Http\Controllers\Admin\ApplicationsController::class, 'index'])->name('admin.applications.index');
        Route::post('applications/{application}/approve', [\App\Http\Controllers\Admin\ApplicationsController::class, 'approve'])->name('admin.applications.approve');
        Route::post('applications/{application}/reject', [\App\Http\Controllers\Admin\ApplicationsController::class, 'reject'])->name('admin.applications.reject');
        Route::resource('chef-availability', \App\Http\Controllers\Admin\ChefAvailabilityController::class);
        Route::post('chef-availability/{availability}/update-status', [\App\Http\Controllers\Admin\ChefAvailabilityController::class, 'updateStatus'])->name('admin.chef-availability.update-status');
        Route::resource('chefs', \App\Http\Controllers\Admin\ChefsController::class);
        Route::post('chefs/{chef}/approve', [\App\Http\Controllers\Admin\ChefsController::class, 'approve'])->name('admin.chefs.approve');
        Route::post('chefs/{chef}/decline', [\App\Http\Controllers\Admin\ChefsController::class, 'decline'])->name('admin.chefs.decline');
    });

    // Chef Routes
    Route::prefix('culinary')->middleware(['role:CHEF'])->group(function () {
        Route::get('/', [ChefDashboard::class, 'index'])->name('chef.dashboard');
        Route::post('orders/{order}/accept', [ChefDashboard::class, 'acceptOrder'])->name('chef.orders.accept');
        Route::post('orders/{order}/en-route', [ChefDashboard::class, 'markEnRoute'])->name('chef.orders.en-route');
        Route::post('orders/{order}/complete', [ChefDashboard::class, 'completeOrder'])->name('chef.orders.complete');
    });

    // Member Routes
    Route::prefix('elite')->middleware(['role:MEMBER'])->group(function () {
        Route::get('/', [MemberDashboard::class, 'index'])->name('member.dashboard');
        Route::get('/book', [MemberDashboard::class, 'book'])->name('member.book');
        Route::post('/book', [MemberDashboard::class, 'storeBooking'])->name('member.store-booking');
        Route::get('/checkout/{order}', function (App\Models\Order $order) {
            return view('member.checkout', compact('order'));
        })->name('member.checkout');
        Route::get('/upgrade', [\App\Http\Controllers\Member\UpgradeController::class, 'index'])->name('member.upgrade');
        Route::post('/upgrade', [\App\Http\Controllers\Member\UpgradeController::class, 'upgrade'])->name('member.upgrade');
        Route::resource('referrals', \App\Http\Controllers\Member\ReferralController::class);
    });

    // Payment Routes
    Route::post('/payment/create-intent/{order}', [PaymentController::class, 'createPaymentIntent'])->name('payment.create-intent');
    Route::post('/payment/confirm/{order}', [PaymentController::class, 'confirmPayment'])->name('payment.confirm');
    
    // API Routes
    Route::get('/api/verify-member/{qrCode}', [\App\Http\Controllers\Api\VerifyMemberController::class, 'verify']);
});

// Stripe Webhook (no auth required)
Route::post('/stripe/webhook', [PaymentController::class, 'webhook'])->name('stripe.webhook');

Route::get('/health', function () {
    return response()->json(['status' => 'Culixur is operational', 'timestamp' => now()]);
});

require __DIR__.'/auth.php';
