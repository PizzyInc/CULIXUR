<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChefAvailability;
use App\Models\User;
use Illuminate\Http\Request;

class ChefAvailabilityController extends Controller
{
    public function index()
    {
        $chefs = User::where('role', 'CHEF')->with('chefProfile')->get();
        $availabilities = ChefAvailability::with('chef')->latest()->paginate(20);
        
        return view('admin.chef-availability.index', compact('chefs', 'availabilities'));
    }

    public function create()
    {
        $chefs = User::where('role', 'CHEF')->with('chefProfile')->get();
        return view('admin.chef-availability.create', compact('chefs'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'chef_id' => 'required|exists:users,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'status' => 'required|in:AVAILABLE,BOOKED,UNAVAILABLE',
        ]);

        ChefAvailability::create($request->all());

        return redirect()->route('admin.chef-availability.index')->with('success', 'Chef availability updated successfully!');
    }

    public function updateStatus(Request $request, ChefAvailability $availability)
    {
        $request->validate([
            'status' => 'required|in:AVAILABLE,BOOKED,UNAVAILABLE',
        ]);

        $availability->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Chef availability status updated successfully!');
    }

    public function destroy(ChefAvailability $availability)
    {
        $availability->delete();
        return redirect()->back()->with('success', 'Chef availability removed successfully!');
    }
}
