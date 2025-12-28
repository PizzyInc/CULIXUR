<x-app-layout>
    <x-slot name="header">
        <h2 class="font-serif font-bold text-2xl text-brand-brown leading-tight">
            {{ __('Experience Settlement') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
            <!-- Order Summary -->
            <div class="card-luxury p-10 mb-12">
                <div class="text-center mb-10 text-center">
                    <span class="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] mb-4 block">The Selection</span>
                    <h3 class="font-serif text-3xl font-bold text-brand-brown">Order Identity</h3>
                    <p class="text-xs text-brand-brown/40 font-bold uppercase tracking-widest mt-2">#{{ $order->id }}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <p class="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-2">The Experience</p>
                        <p class="font-serif text-xl font-bold text-brand-brown">{{ $order->service_type_display }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-2">Date & Time</p>
                        <p class="font-serif text-xl font-bold text-brand-brown">{{ $order->datetime->format('M j, Y') }}</p>
                        <p class="text-xs text-brand-brown/50">{{ $order->datetime->format('g:i A') }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-2">Guest Sanctuary</p>
                        <p class="font-serif text-xl font-bold text-brand-brown">{{ $order->guest_count }} Guests</p>
                    </div>
                    <div>
                        <p class="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-2">Location</p>
                        <p class="text-sm text-brand-brown/70 leading-relaxed">{{ $order->address }}</p>
                    </div>
                </div>

                <div class="mt-10 pt-10 border-t border-brand-brown/5">
                    <p class="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-4">Menu Selection</p>
                    <div class="p-6 bg-brand-ivory/50 rounded-xl">
                        <p class="text-sm text-brand-brown italic font-serif leading-relaxed line-clamp-2">"{{ $order->menu }}"</p>
                    </div>
                </div>

                @if($order->allergies)
                    <div class="mt-6">
                        <p class="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-2">Sanctuary Restrictions</p>
                        <p class="text-xs text-brand-brown/60">{{ $order->allergies }}</p>
                    </div>
                @endif
            </div>

            <!-- Payment Section -->
            <div class="card-luxury p-10 bg-brand-burgundy text-white">
                <div class="text-center mb-10">
                    <span class="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em] mb-4 block">Secure Settlement</span>
                    <h3 class="font-serif text-3xl font-bold">The Investment</h3>
                </div>

                <div class="flex justify-between items-center mb-10 border-b border-white/10 pb-10">
                    <span class="text-[10px] font-bold text-white/50 uppercase tracking-widest">Grand Total</span>
                    <span class="font-serif text-4xl font-bold">₦{{ number_format($order->price, 2) }}</span>
                </div>
                
                <!-- Stripe Payment Form -->
                <form id="payment-form" class="space-y-8">
                    <div id="payment-element" class="bg-white/5 p-6 rounded-xl border border-white/10">
                        <!-- Stripe Elements will mount here -->
                    </div>
                    
                    <button id="submit" class="w-full bg-brand-gold text-brand-brown text-xs font-bold uppercase tracking-[0.2em] py-5 rounded-full hover:bg-white transition-all shadow-xl transform hover:-translate-y-1">
                        <span id="button-text">Authorize Payment</span>
                        <div id="spinner" class="hidden">Authorizing...</div>
                    </button>
                    
                    <div class="flex items-center justify-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
                        Encrypted Security by Stripe
                    </div>
                </form>
            </div>

                    <!-- Security Notice -->
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-green-800">Secure Payment</h3>
                                <div class="mt-2 text-sm text-green-700">
                                    <p>Your payment is processed securely by Stripe. We never store your card details.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://js.stripe.com/v3/"></script>
    <script>
        const stripe = Stripe('{{ config('services.stripe.key') }}');
        let clientSecret;

        // Initialize payment
        async function initializePayment() {
            try {
                const response = await fetch('{{ route('payment.create-intent', $order) }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                });

                const { client_secret } = await response.json();
                clientSecret = client_secret;

                const elements = stripe.elements({ clientSecret });
                const paymentElement = elements.create('payment');
                paymentElement.mount('#payment-element');
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // Handle form submission
        document.getElementById('payment-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = document.getElementById('submit');
            const buttonText = document.getElementById('button-text');
            const spinner = document.getElementById('spinner');

            submitButton.disabled = true;
            buttonText.classList.add('hidden');
            spinner.classList.remove('hidden');

            try {
                const { error } = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: window.location.href,
                    },
                });

                if (error) {
                    console.error('Error:', error);
                    alert('Payment failed: ' + error.message);
                } else {
                    // Payment succeeded
                    window.location.href = '{{ route('member.dashboard') }}';
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during payment processing.');
            } finally {
                submitButton.disabled = false;
                buttonText.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        });

        // Initialize payment on page load
        initializePayment();
    </script>
</x-app-layout>
