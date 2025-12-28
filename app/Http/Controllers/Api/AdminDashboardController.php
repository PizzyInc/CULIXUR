<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Menu;
use App\Models\MembershipApplication;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $liveOrdersCount = Order::whereNotIn('status', ['COMPLETED', 'CANCELLED'])->count();
        $activeChefsCount = User::where('role', 'CHEF')->where('is_approved', true)->count();
        $pendingAppsCount = MembershipApplication::where('status', 'PENDING')->count();
        
        $recentLogistics = Order::with(['member', 'chef'])
            ->latest()
            ->take(5)
            ->get();

        $pendingApplications = MembershipApplication::where('status', 'PENDING')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'live_orders' => $liveOrdersCount,
                'active_chefs' => $activeChefsCount,
                'review_queue' => $pendingAppsCount,
                'aov' => Order::where('status', 'COMPLETED')->avg('price') ?? 0,
            ],
            'recent_logistics' => $recentLogistics,
            'pending_applications' => $pendingApplications,
        ]);
    }

    public function users()
    {
        return response()->json(User::latest()->get());
    }

    public function bookings()
    {
        return response()->json(Order::with(['member', 'chef', 'menu'])->latest()->get());
    }

    public function menus()
    {
        return response()->json(Menu::latest()->get());
    }
}
