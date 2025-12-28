<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'PENDING')->count(),
            'completed_orders' => Order::where('status', 'COMPLETED')->count(),
            'total_members' => User::where('role', 'MEMBER')->count(),
            'total_chefs' => User::where('role', 'CHEF')->count(),
        ];

        $recent_orders = Order::with(['member', 'chef'])
            ->latest()
            ->limit(10)
            ->get();

        $pending_orders = Order::with(['member'])
            ->where('status', 'PENDING')
            ->latest()
            ->get();

        return view('admin.dashboard', compact('stats', 'recent_orders', 'pending_orders'));
    }
}
