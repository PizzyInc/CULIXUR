<x-app-layout>
    <x-slot name="header">
        <h2 class="font-serif font-bold text-2xl text-brand-brown leading-tight">
            {{ __('Private Concierge Booking') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <form method="POST" action="{{ route('member.store-booking') }}" class="space-y-6">
                        @csrf
                        
            <!-- Step Indicator -->
            <div class="mb-16">
                <div class="flex items-center justify-center max-w-xl mx-auto">
                    <!-- Step 1 -->
                    <div class="flex flex-col items-center relative flex-1">
                        <div class="w-10 h-10 bg-brand-burgundy text-brand-ivory rounded-full flex items-center justify-center text-xs font-bold z-10 shadow-lg">1</div>
                        <span class="mt-3 text-[10px] font-bold uppercase tracking-widest text-brand-brown">Experience</span>
                        <div class="absolute top-5 left-1/2 w-full h-[1px] bg-brand-brown/10"></div>
                    </div>
                    <!-- Step 2 -->
                    <div class="flex flex-col items-center relative flex-1">
                        <div class="w-10 h-10 bg-brand-ivory text-brand-brown border border-brand-brown/10 rounded-full flex items-center justify-center text-xs font-bold z-10">2</div>
                        <span class="mt-3 text-[10px] font-bold uppercase tracking-widest text-brand-muted">The Chef</span>
                        <div class="absolute top-5 left-1/2 w-full h-[1px] bg-brand-brown/10"></div>
                    </div>
                    <!-- Step 3 -->
                    <div class="flex flex-col items-center relative flex-1">
                        <div class="w-10 h-10 bg-brand-ivory text-brand-brown border border-brand-brown/10 rounded-full flex items-center justify-center text-xs font-bold z-10">3</div>
                        <span class="mt-3 text-[10px] font-bold uppercase tracking-widest text-brand-muted">Logistics</span>
                    </div>
                </div>
            </div>

            <div class="card-luxury p-10 md:p-16 max-w-4xl mx-auto">
                <form method="POST" action="{{ route('member.store-booking') }}" class="space-y-12">
                    @csrf
                    
                    <!-- Step 1: Selection -->
                    <div id="step-1" class="space-y-10">
                        <div class="text-center mb-10">
                            <h3 class="font-serif text-3xl font-bold text-brand-brown mb-2">Select Your Experience</h3>
                            <p class="text-sm text-brand-brown/50 italic">Choose the culinary atmosphere for your event</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label for="service_type" class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3">Experience Type</label>
                                <select name="service_type" id="service_type" class="w-full bg-brand-ivory/50 border border-brand-brown/10 rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all" required>
                                    <option value="">Choose an Experience</option>
                                    <option value="ATELIER">The Atelier - Premium</option>
                                    <option value="BOARDROOM">The Boardroom - Executive</option>
                                    <option value="GATHERING">The Gathering - Social</option>
                                    <option value="RENDEZVOUS">The Rendez-Vous - Romantic</option>
                                </select>
                            </div>

                            <div>
                                <label for="menu_id" class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3">The Menu Selection</label>
                                <select name="menu_id" id="menu_id" class="w-full bg-brand-ivory/50 border border-brand-brown/10 rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all" required>
                                    <option value="">Awaiting Experience...</option>
                                    @foreach($menus as $menu)
                                        <option value="{{ $menu->id }}">{{ $menu->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: The Chef (Wait for further refinement for visual cards) -->
                    <div id="step-2" class="space-y-10 hidden">
                        <div class="text-center">
                            <h3 class="font-serif text-3xl font-bold text-brand-brown mb-2">Preferred Chef Selection</h3>
                            <p class="text-sm text-brand-brown/50 italic">Select the master behind your menu (Up to 3)</p>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            @foreach($chefs as $chef)
                                <div class="card-luxury p-6 relative group cursor-pointer border-brand-brown/5">
                                    <label class="flex items-center gap-4 cursor-pointer">
                                        <input type="checkbox" name="selected_chefs[]" value="{{ $chef->id }}" class="w-5 h-5 rounded border-brand-brown/10 text-brand-burgundy focus:ring-brand-gold">
                                        <div class="flex-1">
                                            <h4 class="font-serif font-bold text-brand-brown">{{ $chef->name }}</h4>
                                            <p class="text-[10px] uppercase font-bold text-brand-gold tracking-widest">{{ $chef->chefProfile?->specialty ?? 'High Cuisine' }}</p>
                                        </div>
                                    </label>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    <!-- Step 3: Logistics -->
                    <div id="step-3" class="space-y-10 hidden">
                        <div class="text-center">
                            <h3 class="font-serif text-3xl font-bold text-brand-brown mb-2">The Logistics</h3>
                            <p class="text-sm text-brand-brown/50 italic">Finalize the details of your sanctuary experience</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label for="datetime" class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3">Preferred Date & Time</label>
                                <input type="datetime-local" name="datetime" id="datetime" class="w-full bg-brand-ivory/50 border border-brand-brown/10 rounded-xl px-6 py-4 text-sm" required>
                            </div>
                            <div>
                                <label for="guest_count" class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3">Number of Guests</label>
                                <input type="number" name="guest_count" id="guest_count" min="1" max="20" class="w-full bg-brand-ivory/50 border border-brand-brown/10 rounded-xl px-6 py-4 text-sm" placeholder="1-20" required>
                            </div>
                            <div class="md:col-span-2">
                                <label for="address" class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3">Service Address</label>
                                <textarea name="address" id="address" rows="2" class="w-full bg-brand-ivory/50 border border-brand-brown/10 rounded-xl px-6 py-4 text-sm" placeholder="The sanctuary location for the event..." required></textarea>
                            </div>
                            <div class="md:col-span-2">
                                <label for="allergies" class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3">Dietary Sanctuary Requirements</label>
                                <textarea name="allergies" id="allergies" rows="2" class="w-full bg-brand-ivory/50 border border-brand-brown/10 rounded-xl px-6 py-4 text-sm" placeholder="Any allergies or specific requirements..."></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Actions -->
                    <div class="pt-10 border-t border-brand-brown/5 flex justify-between items-center">
                        <div id="price-summary" class="text-left">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-brand-muted block">Estimated Investment</span>
                            <span id="price-display" class="font-serif text-3xl font-bold text-brand-brown">₦0.00</span>
                        </div>
                        
                        <div class="flex gap-4">
                            <button type="button" id="prev-btn" class="hidden px-8 py-4 text-xs font-bold uppercase tracking-widest text-brand-brown hover:text-brand-gold transition-colors">Previous</button>
                            <button type="button" id="next-btn" class="btn-luxury px-12 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-xl">Continue</button>
                            <button type="submit" id="submit-btn" class="hidden btn-luxury px-12 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-xl">Complete Booking</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        const steps = ['step-1', 'step-2', 'step-3'];
        let currentStep = 0;

        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const submitBtn = document.getElementById('submit-btn');

        function updateStep() {
            steps.forEach((step, index) => {
                document.getElementById(step).classList.toggle('hidden', index !== currentStep);
            });

            prevBtn.classList.toggle('hidden', currentStep === 0);
            nextBtn.classList.toggle('hidden', currentStep === steps.length - 1);
            submitBtn.classList.toggle('hidden', currentStep !== steps.length - 1);
        }

        nextBtn.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateStep();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStep();
            }
        });
    </script>

    <script>
        document.getElementById('service_type').addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            const priceDisplay = document.getElementById('price-display');
            
            if (price) {
                priceDisplay.textContent = '₦' + parseInt(price).toLocaleString();
            } else {
                priceDisplay.textContent = '₦0.00';
            }
        });
    </script>
</x-app-layout>
