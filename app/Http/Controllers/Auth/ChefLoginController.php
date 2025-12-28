<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ChefLoginController extends Controller
{
    /**
     * Display the chef login view.
     */
    public function create()
    {
        return view('auth.chef-login');
    }

    /**
     * Handle chef login with chef ID and passphrase.
     */
    public function store(Request $request)
    {
        $request->validate([
            'chef_id' => 'required|string',
            'passphrase' => 'required|string',
        ]);

        // Find user by chef ID
        $user = User::where('chef_id', $request->chef_id)
                   ->where('role', 'CHEF')
                   ->first();

        if (!$user) {
            return back()->withErrors([
                'chef_id' => 'Invalid Chef ID.',
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

        return redirect()->intended('/culinary');
    }
}
