<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UpgradeController extends Controller
{
    public function index()
    {
        return view('member.upgrade');
    }

    public function upgrade(Request $request)
    {
        $request->validate([
            'tier' => 'required|in:12_MONTH,6_MONTH',
        ]);

        $user = Auth::user();
        
        // Update user's membership tier
        $user->update([
            'membership_tier' => $request->tier,
        ]);

        // Here you would typically:
        // 1. Process payment for the subscription
        // 2. Generate physical elite card
        // 3. Send confirmation email
        // 4. Update user's order limits

        return redirect()->route('member.dashboard')->with('success', 'Congratulations! You have successfully upgraded to ' . ($request->tier === '12_MONTH' ? '12-Month' : '6-Month') . ' Elite Membership. Your physical elite card will be shipped to you within 5-7 business days.');
    }
}
