<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Menu Details') }}
            </h2>
            <div class="flex space-x-2">
                <a href="{{ route('admin.menus.edit', $menu) }}" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Edit Menu
                </a>
                <a href="{{ route('admin.menus.index') }}" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Back to Menus
                </a>
            </div>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Menu Information -->
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Menu Information</h3>
                            <dl class="space-y-4">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Name</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ $menu->name }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Service Type</dt>
                                    <dd class="mt-1">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            @if($menu->service_type === 'ATELIER') bg-yellow-100 text-yellow-800
                                            @elseif($menu->service_type === 'BOARDROOM') bg-blue-100 text-blue-800
                                            @elseif($menu->service_type === 'GATHERING') bg-green-100 text-green-800
                                            @else bg-pink-100 text-pink-800
                                            @endif">
                                            {{ $menu->service_type_display }}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Price</dt>
                                    <dd class="mt-1 text-sm text-gray-900 text-2xl font-bold text-indigo-600">{{ $menu->formatted_price }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Created</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ $menu->created_at->format('M j, Y g:i A') }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ $menu->updated_at->format('M j, Y g:i A') }}</dd>
                                </div>
                            </dl>
                        </div>

                        <!-- Description -->
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Description</h3>
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-700">{{ $menu->description }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="mt-8 pt-6 border-t border-gray-200">
                        <div class="flex justify-between">
                            <div class="flex space-x-3">
                                <a href="{{ route('admin.menus.edit', $menu) }}" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                                    Edit Menu
                                </a>
                                <form method="POST" action="{{ route('admin.menus.destroy', $menu) }}" class="inline" onsubmit="return confirm('Are you sure you want to delete this menu? This action cannot be undone.')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                        Delete Menu
                                    </button>
                                </form>
                            </div>
                            <a href="{{ route('admin.menus.index') }}" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                Back to Menus
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
