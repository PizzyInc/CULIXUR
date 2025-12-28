<x-app-layout>
    <x-slot name="header">
        <h2 class="font-serif font-bold text-2xl text-brand-brown leading-tight">
            {{ __('Chef Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <!-- Assigned Orders -->
            @if($assigned_orders->count() > 0)
                <div class="mb-8">
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6 text-gray-900">
                            <h3 class="font-serif text-xl font-bold text-brand-brown mb-6">Your Assigned Orders</h3>
                            <div class="space-y-6">
                                @foreach($assigned_orders as $order)
                                    <div class="card-luxury p-8 border border-brand-brown/5">
                                        <div class="flex justify-between items-start">
                                            <div class="flex-1">
                                                <div class="flex items-center space-x-8">
                                                    <div>
                                                        <h4 class="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Order ID</h4>
                                                        <p class="font-serif text-lg font-bold text-brand-brown">#{{ $order->id }}</p>
                                                        <p class="text-[10px] font-medium text-brand-gold uppercase tracking-wider">{{ $order->service_type_display }}</p>
                                                    </div>
                                                    <div>
                                                        <h4 class="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Client</h4>
                                                        <p class="font-medium text-brand-brown">{{ $order->member->name }}</p>
                                                        <p class="text-xs text-brand-brown/60">{{ $order->datetime->format('M j, Y g:i A') }}</p>
                                                    </div>
                                                    <div>
                                                        <h4 class="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Fee</h4>
                                                        <p class="font-serif font-bold text-brand-brown">₦{{ number_format($order->price, 2) }}</p>
                                                        <p class="text-xs text-brand-brown/60">{{ $order->guest_count }} guests</p>
                                                    </div>
                                                </div>
                                                <div class="mt-2">
                                                    <p class="text-sm text-gray-600"><strong>Address:</strong> {{ $order->address }}</p>
                                                    <p class="text-sm text-gray-600"><strong>Menu:</strong> {{ Str::limit($order->menu, 100) }}</p>
                                                    @if($order->allergies)
                                                        <p class="text-sm text-red-600"><strong>Allergies:</strong> {{ $order->allergies }}</p>
                                                    @endif
                                                </div>
                                            </div>
                                            <div class="ml-4 flex space-x-2">
                                                @if($order->status === 'ASSIGNED')
                                                    <form method="POST" action="{{ route('chef.orders.accept', $order) }}">
                                                        @csrf
                                                        <button type="submit" class="brand-btn-primary text-[10px] font-bold uppercase tracking-widest py-2 px-6 rounded-full">
                                                            Accept
                                                        </button>
                                                    </form>
                                                @elseif($order->status === 'ACCEPTED')
                                                    <form method="POST" action="{{ route('chef.orders.en-route', $order) }}">
                                                        @csrf
                                                        <button type="submit" class="brand-btn-primary text-[10px] font-bold uppercase tracking-widest py-2 px-6 rounded-full">
                                                            Mark En Route
                                                        </button>
                                                    </form>
                                                @elseif($order->status === 'EN_ROUTE')
                                                    <form method="POST" action="{{ route('chef.orders.complete', $order) }}">
                                                        @csrf
                                                        <button type="submit" class="brand-btn-primary text-[10px] font-bold uppercase tracking-widest py-2 px-6 rounded-full">
                                                            Complete
                                                        </button>
                                                    </form>
                                                @endif
                                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    @if($order->status === 'ASSIGNED') bg-yellow-100 text-yellow-800
                                                    @elseif($order->status === 'ACCEPTED') bg-green-100 text-green-800
                                                    @elseif($order->status === 'EN_ROUTE') bg-purple-100 text-purple-800
                                                    @else bg-gray-100 text-gray-800
                                                    @endif">
                                                    {{ $order->status_display }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
            @endif

            <!-- Completed Orders -->
            @if($completed_orders->count() > 0)
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Completed Orders</h3>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    @foreach($completed_orders as $order)
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{{ $order->id }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ $order->member->name }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ $order->service_type_display }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ $order->datetime->format('M j, Y') }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ₦{{ number_format($order->price, 2) }}
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            @endif

            @if($assigned_orders->count() === 0 && $completed_orders->count() === 0)
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <div class="text-center py-8">
                            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 class="mt-2 text-sm font-medium text-gray-900">No orders assigned</h3>
                            <p class="mt-1 text-sm text-gray-500">You'll receive notifications when orders are assigned to you.</p>
                        </div>
                    </div>
                </div>
            @endif
        </div>
    </div>
</x-app-layout>
