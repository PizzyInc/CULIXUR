<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ChefProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Notifications\ChefAccountApprovedNotification;

class ChefsController extends Controller
{
    public function index()
    {
        $chefs = User::where('role', 'CHEF')
            ->with('chefProfile')
            ->latest()
            ->paginate(20);
        
        return view('admin.chefs.index', compact('chefs'));
    }

    public function create()
    {
        return view('admin.chefs.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'specialty' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'experience_years' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Generate unique Chef ID
        $chefId = 'CHEF-' . strtoupper(Str::random(6));
        while (User::where('chef_id', $chefId)->exists()) {
            $chefId = 'CHEF-' . strtoupper(Str::random(6));
        }

        // Create chef user
        $chef = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'CHEF',
            'chef_id' => $chefId,
            'is_approved' => false, // New chefs need approval
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('chef-images', 'public');
        }

        // Create chef profile
        ChefProfile::create([
            'user_id' => $chef->id,
            'specialty' => $request->specialty,
            'phone_number' => $request->phone_number,
            'bio' => $request->bio,
            'experience_years' => $request->experience_years,
            'image' => $imagePath,
        ]);

        return redirect()->route('admin.chefs.index')->with('success', 'Chef created successfully! They will need approval before they can receive orders.');
    }

    public function show(User $chef)
    {
        $chef->load('chefProfile');
        return view('admin.chefs.show', compact('chef'));
    }

    public function edit(User $chef)
    {
        $chef->load('chefProfile');
        return view('admin.chefs.edit', compact('chef'));
    }

    public function update(Request $request, User $chef)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $chef->id,
            'specialty' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'experience_years' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Update chef user
        $chef->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Handle image upload
        $imagePath = $chef->chefProfile?->image;
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('chef-images', 'public');
        }

        // Update chef profile
        if ($chef->chefProfile) {
            $chef->chefProfile->update([
                'specialty' => $request->specialty,
                'phone_number' => $request->phone_number,
                'bio' => $request->bio,
                'experience_years' => $request->experience_years,
                'image' => $imagePath,
            ]);
        } else {
            ChefProfile::create([
                'user_id' => $chef->id,
                'specialty' => $request->specialty,
                'phone_number' => $request->phone_number,
                'bio' => $request->bio,
                'experience_years' => $request->experience_years,
                'image' => $imagePath,
            ]);
        }

        return redirect()->route('admin.chefs.index')->with('success', 'Chef updated successfully!');
    }

    public function approve(User $chef)
    {
        $chef->update(['is_approved' => true]);
        
        // Notify Chef
        $chef->notify(new ChefAccountApprovedNotification());

        return redirect()->back()->with('success', 'Chef approved and notified!');
    }

    public function decline(User $chef)
    {
        $chef->update(['is_approved' => false]);
        return redirect()->back()->with('success', 'Chef declined successfully!');
    }

    public function destroy(User $chef)
    {
        // Delete chef image if exists
        if ($chef->chefProfile?->image && Storage::disk('public')->exists($chef->chefProfile->image)) {
            Storage::disk('public')->delete($chef->chefProfile->image);
        }
        
        $chef->delete();
        return redirect()->route('admin.chefs.index')->with('success', 'Chef deleted successfully!');
    }
}
