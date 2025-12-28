<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Menu;
use App\Models\User;
use App\Models\Event;
use Illuminate\Http\Request;

use App\Notifications\OrderConfirmationMemberNotification;
use App\Notifications\NewOrderChefNotification;
use App\Notifications\NewOrderAdminNotification;
use Illuminate\Support\Facades\Notification;

class MemberDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $orders = Order::where('member_id', $user->id)
            ->with(['chef'])
            ->latest()
            ->take(5)
            ->get();

        $upcomingEvents = Event::where('status', 'ACTIVE')
            ->where('date', '>=', now())
            ->take(3)
            ->get();

        return response()->json([
            'user' => [
                'name' => $user->name,
                'member_id' => $user->member_id,
                'email' => $user->email,
                'is_elite' => $user->isElite(),
                'image' => $user->image,
                'qr_code' => $user->qr_code,
            ],
            'orders' => $orders,
            'upcoming_events' => $upcomingEvents,
        ]);
    }

    public function bookingDetails()
    {
        $menus = Menu::latest()->get();
        $chefs = User::where('role', 'CHEF')
            ->where('is_approved', true)
            ->get();

        return response()->json([
            'menus' => $menus,
            'chefs' => $chefs->map(function ($chef) {
                return [
                    'id' => $chef->id,
                    'name' => $chef->name,
                    'specialty' => $chef->chefProfile?->specialty ?? 'Master Chef',
                    'avatar' => $chef->image ?? `https://ui-avatars.com/api/?name=${urlencode($chef->name)}&background=654321&color=fff`,
                ];
            }),
        ]);
    }

    public function storeBooking(Request $request)
    {
        $request->validate([
            'service_type' => 'required|in:ATELIER,BOARDROOM,GATHERING,RENDEZVOUS',
            'menu_id' => 'required|exists:menus,id',
            'selected_chefs' => 'required|array|min:1|max:3',
            'selected_chefs.*' => 'exists:users,id',
            'datetime' => 'required|date|after:now',
            'address' => 'required|string',
            'guest_count' => 'required|integer|min:1',
            'allergies' => 'nullable|string',
        ]);

        $menu = Menu::findOrFail($request->menu_id);
        
        $order = Order::create([
            'service_type' => $request->service_type,
            'menu' => $menu->name,
            'price' => $menu->fixed_price,
            'datetime' => $request->datetime,
            'address' => $request->address,
            'guest_count' => $request->guest_count,
            'allergies' => $request->allergies,
            'member_id' => auth()->id(),
            'status' => 'PENDING',
            'selected_chefs' => $request->selected_chefs,
        ]);

        // Generate Order ID for display
        $order->order_id = 'ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT);
        $order->save();

        // 1. Notify Member
        auth()->user()->notify(new OrderConfirmationMemberNotification($order));

        // 2. Notify Selected Chefs
        $chefs = User::whereIn('id', $request->selected_chefs)->get();
        Notification::send($chefs, new NewOrderChefNotification($order));

        // 3. Notify Admin(s)
        $admins = User::where('role', 'ADMIN')->get();
        Notification::send($admins, new NewOrderAdminNotification($order));

        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully and notifications dispatched.',
            'order_id' => $order->id,
            'order_number' => $order->order_id,
        ]);
    }
}
