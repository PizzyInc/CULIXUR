<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MembershipApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Notifications\MemberAccountApprovedNotification;

class ApplicationsController extends Controller
{
    public function index()
    {
        $applications = MembershipApplication::latest()->paginate(20);
        return view('admin.applications.index', compact('applications'));
    }

    public function approve(MembershipApplication $application)
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

        // Notify Member
        $user->notify(new MemberAccountApprovedNotification($passphrase));

        return redirect()->back()->with('success', 'Application approved and member notified!');
    }

    public function reject(MembershipApplication $application)
    {
        $application->update(['status' => 'REJECTED']);
        return redirect()->back()->with('success', 'Application rejected.');
    }
}
