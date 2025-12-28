<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class MemberLoginController extends Controller
{
    /**
     * Display the member login view.
     */
    public function create()
    {
        return view('auth.member-login');
    }

    /**
     * Handle member login with member ID and passphrase.
     */
    public function store(Request $request)
    {
        $request->validate([
            'member_id' => 'required|string',
            'passphrase' => 'required|string',
        ]);

        // Find user by member ID
        $user = User::where('member_id', $request->member_id)
                   ->where('role', 'MEMBER')
                   ->first();

        if (!$user) {
            return back()->withErrors([
                'member_id' => 'Invalid member ID.',
            ])->withInput();
        }

        // Check passphrase (stored as password)
        if (!Hash::check($request->passphrase, $user->password)) {
            return back()->withErrors([
                'passphrase' => 'Invalid passphrase.',
            ])->withInput();
        }

        // Login the user
        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->intended('/member');
    }
}
