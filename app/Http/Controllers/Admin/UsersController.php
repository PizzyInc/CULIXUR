<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ChefProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    public function index()
    {
        $users = User::with('chefProfile')->latest()->paginate(20);
        return view('admin.users.index', compact('users'));
    }

    public function create()
    {
        return view('admin.users.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:ADMIN,CHEF,MEMBER',
            'specialty' => 'required_if:role,CHEF|string|max:255',
            'phone_number' => 'required_if:role,CHEF|string|max:255',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'member_id' => $request->role === 'MEMBER' ? 'MEM' . str_pad(User::where('role', 'MEMBER')->count() + 1, 3, '0', STR_PAD_LEFT) : null,
            'qr_code' => $request->role === 'MEMBER' ? 'CULIXUR_' . time() . '_' . str_pad(User::where('role', 'MEMBER')->count() + 1, 3, '0', STR_PAD_LEFT) : null,
        ]);

        if ($request->role === 'CHEF') {
            ChefProfile::create([
                'user_id' => $user->id,
                'specialty' => $request->specialty,
                'phone_number' => $request->phone_number,
            ]);
        }

        return redirect()->route('admin.users.index')->with('success', 'User created successfully!');
    }

    public function show(User $user)
    {
        $user->load('chefProfile');
        return view('admin.users.show', compact('user'));
    }

    public function edit(User $user)
    {
        $user->load('chefProfile');
        return view('admin.users.edit', compact('user'));
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:ADMIN,CHEF,MEMBER',
            'specialty' => 'required_if:role,CHEF|string|max:255',
            'phone_number' => 'required_if:role,CHEF|string|max:255',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        if ($request->role === 'CHEF') {
            if ($user->chefProfile) {
                $user->chefProfile->update([
                    'specialty' => $request->specialty,
                    'phone_number' => $request->phone_number,
                ]);
            } else {
                ChefProfile::create([
                    'user_id' => $user->id,
                    'specialty' => $request->specialty,
                    'phone_number' => $request->phone_number,
                ]);
            }
        }

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully!');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully!');
    }
}
