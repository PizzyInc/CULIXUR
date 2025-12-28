<?php

namespace App\Http\Controllers\Chef;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $assigned_orders = Order::with(['member'])
            ->where('chef_id', $user->id)
            ->whereIn('status', ['ASSIGNED', 'ACCEPTED', 'EN_ROUTE'])
            ->latest()
            ->get();

        $completed_orders = Order::with(['member'])
            ->where('chef_id', $user->id)
            ->where('status', 'COMPLETED')
            ->latest()
            ->limit(10)
            ->get();

        return view('chef.dashboard', compact('assigned_orders', 'completed_orders'));
    }

    public function acceptOrder(Order $order)
    {
        if ($order->chef_id !== auth()->id()) {
            return redirect()->back()->with('error', 'You are not assigned to this order.');
        }

        $order->update(['status' => 'ACCEPTED']);
        
        return redirect()->back()->with('success', 'Order accepted successfully!');
    }

    public function markEnRoute(Order $order)
    {
        if ($order->chef_id !== auth()->id()) {
            return redirect()->back()->with('error', 'You are not assigned to this order.');
        }

        $order->update(['status' => 'EN_ROUTE']);
        
        return redirect()->back()->with('success', 'Order marked as en route!');
    }

    public function completeOrder(Order $order)
    {
        if ($order->chef_id !== auth()->id()) {
            return redirect()->back()->with('error', 'You are not assigned to this order.');
        }

        $order->update(['status' => 'COMPLETED']);
        
        return redirect()->back()->with('success', 'Order completed successfully!');
    }
}
