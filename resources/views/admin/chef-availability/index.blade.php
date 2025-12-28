<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Chef Availability Management') }}
            </h2>
            <a href="{{ route('admin.chef-availability.create') }}" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                Add Availability
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <!-- Chef Status Overview -->
            <div class="mb-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Chef Status Overview</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            @foreach($chefs as $chef)
                                <div class="border border-gray-200 rounded-lg p-4">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h4 class="font-medium text-gray-900">{{ $chef->name }}</h4>
                                            <p class="text-sm text-gray-600">{{ $chef->chefProfile?->specialty ?? 'No specialty' }}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-sm text-gray-600">Today's Status</p>
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Available
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>

            <!-- Availability Schedule -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Availability Schedule</h3>
                    
                    @if($availabilities->count() > 0)
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chef</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    @foreach($availabilities as $availability)
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {{ $availability->chef->name }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ $availability->date->format('M j, Y') }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ $availability->start_time->format('g:i A') }} - {{ $availability->end_time->format('g:i A') }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    @if($availability->status === 'AVAILABLE') bg-green-100 text-green-800
                                                    @elseif($availability->status === 'BOOKED') bg-red-100 text-red-800
                                                    @else bg-gray-100 text-gray-800
                                                    @endif">
                                                    {{ $availability->status_display }}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <form method="POST" action="{{ route('admin.chef-availability.update-status', $availability) }}" class="inline">
                                                    @csrf
                                                    <select name="status" onchange="this.form.submit()" class="text-sm border-gray-300 rounded-md">
                                                        <option value="AVAILABLE" {{ $availability->status === 'AVAILABLE' ? 'selected' : '' }}>Available</option>
                                                        <option value="BOOKED" {{ $availability->status === 'BOOKED' ? 'selected' : '' }}>Booked</option>
                                                        <option value="UNAVAILABLE" {{ $availability->status === 'UNAVAILABLE' ? 'selected' : '' }}>Unavailable</option>
                                                    </select>
                                                </form>
                                                <form method="POST" action="{{ route('admin.chef-availability.destroy', $availability) }}" class="inline ml-2" onsubmit="return confirm('Are you sure you want to delete this availability?')">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="text-red-600 hover:text-red-900">Delete</button>
                                                </form>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="mt-4">
                            {{ $availabilities->links() }}
                        </div>
                    @else
                        <div class="text-center py-8">
                            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 class="mt-2 text-sm font-medium text-gray-900">No availability scheduled</h3>
                            <p class="mt-1 text-sm text-gray-500">Get started by adding chef availability.</p>
                            <div class="mt-6">
                                <a href="{{ route('admin.chef-availability.create') }}" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                    Add Availability
                                </a>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
