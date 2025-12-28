<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Menu;
use App\Models\User;
use App\Mail\AdminOrderNotification;
use App\Mail\ChefBookedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $orders = Order::where('member_id', $user->id)
            ->latest()
            ->paginate(10);

        $upcomingEvents = \App\Models\Event::active()->upcoming()->take(3)->get();

        return view('member.dashboard', compact('orders', 'upcomingEvents'));
    }

    public function book()
    {
        $chefs = \App\Models\User::where('role', 'CHEF')->where('is_approved', true)->with('chefProfile')->get();
        $menus = Menu::all();
        return view('member.book', compact('chefs', 'menus'));
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
        $price = $menu->fixed_price;

        $order = Order::create([
            'service_type' => $request->service_type,
            'menu' => $menu->name,
            'price' => $price,
            'datetime' => $request->datetime,
            'address' => $request->address,
            'guest_count' => $request->guest_count,
            'allergies' => $request->allergies,
            'member_id' => auth()->id(),
            'status' => 'PENDING',
            'selected_chefs' => json_encode($request->selected_chefs),
        ]);

        // Send notifications
        $this->sendOrderNotifications($order);

        return redirect()->route('member.checkout', $order->id);
    }

    private function getDefaultPrice(string $serviceType): float
    {
        return match($serviceType) {
            'ATELIER' => 1500000, // ₦1,500,000
            'BOARDROOM' => 1250000, // ₦1,250,000
            'GATHERING' => 575000, // ₦575,000
            'RENDEZVOUS' => 575000, // ₦575,000
            default => 500000,
        };
    }

    private function sendOrderNotifications(Order $order)
    {
        // Send notification to admin
        $admin = User::where('role', 'ADMIN')->first();
        if ($admin) {
            Mail::to($admin->email)->send(new AdminOrderNotification($order));
        }

        // Send notifications to selected chefs
        $selectedChefIds = json_decode($order->selected_chefs, true);
        if ($selectedChefIds) {
            $chefs = User::whereIn('id', $selectedChefIds)->get();
            foreach ($chefs as $chef) {
                Mail::to($chef->email)->send(new ChefBookedNotification($order, $chef));
            }
        }
    }
}
