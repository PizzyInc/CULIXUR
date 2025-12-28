<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Chef Details') }}
            </h2>
            <div class="flex space-x-3">
                <a href="{{ route('admin.chefs.edit', $chef) }}" class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                    Edit Chef
                </a>
                <a href="{{ route('admin.chefs.index') }}" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Back to List
                </a>
            </div>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- Chef Profile -->
                        <div class="lg:col-span-1">
                            <div class="text-center">
                                @if($chef->chefProfile?->image)
                                    <img class="mx-auto h-32 w-32 rounded-full object-cover" src="{{ Storage::url($chef->chefProfile->image) }}" alt="{{ $chef->name }}">
                                @else
                                    <div class="mx-auto h-32 w-32 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span class="text-4xl font-medium text-gray-700">{{ substr($chef->name, 0, 1) }}</span>
                                    </div>
                                @endif
                                
                                <h3 class="mt-4 text-2xl font-bold text-gray-900">{{ $chef->name }}</h3>
                                <p class="text-lg text-gray-600">{{ $chef->chefProfile?->specialty ?? 'No specialty specified' }}</p>
                                
                                <div class="mt-4">
                                    @if($chef->is_approved)
                                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                            </svg>
                                            Approved
                                        </span>
                                    @else
                                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                            </svg>
                                            Pending Approval
                                        </span>
                                    @endif
                                </div>

                                <!-- Approval Actions -->
                                <div class="mt-6">
                                    @if(!$chef->is_approved)
                                        <form method="POST" action="{{ route('admin.chefs.approve', $chef) }}" class="inline">
                                            @csrf
                                            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                                                Approve Chef
                                            </button>
                                        </form>
                                    @else
                                        <form method="POST" action="{{ route('admin.chefs.decline', $chef) }}" class="inline">
                                            @csrf
                                            <button type="submit" class="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mr-2">
                                                Revoke Approval
                                            </button>
                                        </form>
                                    @endif
                                    
                                    <form method="POST" action="{{ route('admin.chefs.destroy', $chef) }}" class="inline" onsubmit="return confirm('Are you sure you want to delete this chef? This action cannot be undone.')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                            Delete Chef
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- Chef Information -->
                        <div class="lg:col-span-2">
                            <div class="space-y-6">
                                <!-- Contact Information -->
                                <div>
                                    <h4 class="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
                                    <dl class="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                                        <div>
                                            <dt class="text-sm font-medium text-gray-500">Email</dt>
                                            <dd class="text-sm text-gray-900">{{ $chef->email }}</dd>
                                        </div>
                                        <div>
                                            <dt class="text-sm font-medium text-gray-500">Phone</dt>
                                            <dd class="text-sm text-gray-900">{{ $chef->chefProfile?->phone_number ?? 'Not provided' }}</dd>
                                        </div>
                                        <div>
                                            <dt class="text-sm font-medium text-gray-500">Experience</dt>
                                            <dd class="text-sm text-gray-900">{{ $chef->chefProfile?->experience_years ?? 0 }} years</dd>
                                        </div>
                                        <div>
                                            <dt class="text-sm font-medium text-gray-500">Member Since</dt>
                                            <dd class="text-sm text-gray-900">{{ $chef->created_at->format('M j, Y') }}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <!-- Biography -->
                                @if($chef->chefProfile?->bio)
                                    <div>
                                        <h4 class="text-lg font-medium text-gray-900 mb-4">Biography</h4>
                                        <p class="text-sm text-gray-700 leading-relaxed">{{ $chef->chefProfile->bio }}</p>
                                    </div>
                                @endif

                                <!-- Recent Orders -->
                                <div>
                                    <h4 class="text-lg font-medium text-gray-900 mb-4">Recent Orders</h4>
                                    <div class="bg-gray-50 rounded-lg p-4">
                                        <p class="text-sm text-gray-600">Order history will be displayed here once the chef starts receiving orders.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
