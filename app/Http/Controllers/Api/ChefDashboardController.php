<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

use App\Notifications\OrderStatusUpdatedAdminNotification;
use App\Models\User;
use Illuminate\Support\Facades\Notification;

class ChefDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $pendingAssignments = Order::where('chef_id', $user->id)
            ->where('status', 'ASSIGNED')
            ->with(['member'])
            ->latest()
            ->get();

        $activeLogistics = Order::where('chef_id', $user->id)
            ->whereIn('status', ['ACCEPTED', 'EN_ROUTE'])
            ->with(['member'])
            ->latest()
            ->get();

        $completedOrders = Order::where('chef_id', $user->id)
            ->where('status', 'COMPLETED')
            ->with(['member'])
            ->latest()
            ->get();

        return response()->json([
            'user' => [
                'name' => $user->name,
                'chef_id' => $user->chef_id,
            ],
            'pending' => $pendingAssignments,
            'active' => $activeLogistics,
            'completed' => $completedOrders,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:ACCEPTED,EN_ROUTE,COMPLETED',
        ]);

        if ($order->chef_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->update(['status' => $request->status]);

        // Notify Admin(s) of the status update
        $admins = User::where('role', 'ADMIN')->get();
        Notification::send($admins, new OrderStatusUpdatedAdminNotification($order, auth()->user()));

        return response()->json([
            'success' => true,
            'message' => 'Order status updated to ' . $request->status,
            'order' => $order,
        ]);
    }
}
