<?php

namespace App\Http\Controllers;

use App\Models\MembershipApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MembershipController extends Controller
{
    public function create()
    {
        return view('auth.apply');
    }

    public function apply(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'phone' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'elite_category' => 'required|in:BUSINESS_LEADER,INVESTOR,ENTREPRENEUR,EXECUTIVE,PROFESSIONAL,INFLUENCER,CELEBRITY,OTHER',
            'net_worth_range' => 'required|string',
            'industry' => 'nullable|string|max:255',
            'position_title' => 'nullable|string|max:255',
            'achievements' => 'required|string|min:50',
            'social_status' => 'nullable|string|max:255',
            'why_elite' => 'required|string|min:50',
            'membership_tier' => 'nullable|string',
            'referral_code' => 'nullable|string|max:255',
            'message' => 'nullable|string',
            'terms' => 'required|accepted',
        ]);

        // Create membership application
        $application = MembershipApplication::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'company' => $request->company,
            'elite_category' => $request->elite_category,
            'net_worth_range' => $request->net_worth_range,
            'industry' => $request->industry,
            'position_title' => $request->position_title,
            'achievements' => $request->achievements,
            'social_status' => $request->social_status,
            'why_elite' => $request->why_elite,
            'membership_tier' => $request->membership_tier,
            'referral_code' => $request->referral_code,
            'message' => $request->message,
            'status' => 'PENDING',
        ]);

        // If referral code provided, track referral
        if ($request->referral_code) {
            $referrer = User::where('referral_code', $request->referral_code)->first();
            if ($referrer) {
                // Track referral (you can create a referrals table)
                // For now, we'll just note it in the application
            }
        }

        return redirect()->back()->with('success', 'Your application has been submitted successfully! We will review it and contact you within 48 hours.');
    }

    public function approveApplication(MembershipApplication $application)
    {
        // Generate member credentials
        $memberId = 'MEM' . str_pad(User::where('role', 'MEMBER')->count() + 1, 3, '0', STR_PAD_LEFT);
        $passphrase = Str::random(8);
        $qrCode = 'CULIXUR_' . time() . '_' . $memberId;

        // Create user account
        $user = User::create([
            'name' => $application->first_name . ' ' . $application->last_name,
            'email' => $application->email,
            'password' => Hash::make($passphrase),
            'role' => 'MEMBER',
            'member_id' => $memberId,
            'qr_code' => $qrCode,
            'membership_tier' => $application->membership_tier,
            'referral_code' => 'REF' . strtoupper(Str::random(6)),
        ]);

        // Update application status
        $application->update([
            'status' => 'APPROVED',
            'user_id' => $user->id,
        ]);

        // Send welcome email with credentials
        // You can implement email sending here

        return redirect()->back()->with('success', 'Application approved! Member credentials have been generated.');
    }

    public function rejectApplication(MembershipApplication $application)
    {
        $application->update(['status' => 'REJECTED']);
        return redirect()->back()->with('success', 'Application rejected.');
    }
}
