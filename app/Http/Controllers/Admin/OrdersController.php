<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use App\Notifications\NewOrderChefNotification;
use App\Notifications\OrderStatusChangedNotification;

class OrdersController extends Controller
{
    public function index()
    {
        $orders = Order::with(['member', 'chef'])
            ->latest()
            ->paginate(20);

        return view('admin.orders.index', compact('orders'));
    }

    public function show(Order $order)
    {
        $order->load(['member', 'chef']);
        $available_chefs = User::where('role', 'CHEF')
            ->whereDoesntHave('chefOrders', function($query) use ($order) {
                $query->where('datetime', $order->datetime);
            })
            ->get();

        return view('admin.orders.show', compact('order', 'available_chefs'));
    }

    public function assignChef(Request $request, Order $order)
    {
        $request->validate([
            'chef_id' => 'required|exists:users,id'
        ]);

        $order->update([
            'chef_id' => $request->chef_id,
            'status' => 'ASSIGNED'
        ]);

        // Notify Chef
        $chef = User::find($request->chef_id);
        $chef->notify(new NewOrderChefNotification($order));

        return redirect()->back()->with('success', 'Chef assigned and notified successfully!');
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:PENDING,ASSIGNED,ACCEPTED,EN_ROUTE,COMPLETED,CANCELLED'
        ]);

        $order->update(['status' => $request->status]);

        // Notify Member/Chef
        if ($order->member) {
            $order->member->notify(new OrderStatusChangedNotification($order));
        }

        return redirect()->back()->with('success', 'Order status updated and stakeholders notified!');
    }
}
