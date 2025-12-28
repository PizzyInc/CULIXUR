<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Referral;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function index()
    {
        $referrals = Referral::where('referrer_id', auth()->id())
            ->latest()
            ->paginate(10);
        
        return view('member.referrals.index', compact('referrals'));
    }

    public function create()
    {
        return view('member.referrals.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'referred_name' => 'required|string|max:255',
            'referred_email' => 'required|email|max:255',
            'referred_phone' => 'required|string|max:255',
            'referred_occupation' => 'required|string|max:255',
            'is_elite' => 'required|boolean',
            'notes' => 'nullable|string',
        ]);

        Referral::create([
            'referrer_id' => auth()->id(),
            'referred_name' => $request->referred_name,
            'referred_email' => $request->referred_email,
            'referred_phone' => $request->referred_phone,
            'referred_occupation' => $request->referred_occupation,
            'is_elite' => $request->is_elite,
            'notes' => $request->notes,
            'status' => 'PENDING',
        ]);

        return redirect()->route('member.referrals.index')->with('success', 'Referral submitted successfully! We will review and contact the person you referred.');
    }
}
