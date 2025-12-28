<x-app-layout>
    <x-slot name="header">
        <h2 class="font-serif font-bold text-2xl text-brand-brown leading-tight">
            {{ __('Elite Membership Upgrade') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <span class="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] mb-4 block">Elevate Your Legacy</span>
                <h3 class="font-serif text-4xl md:text-5xl font-bold text-brand-brown mb-6 text-center">The Elite Subscription</h3>
                <p class="text-brand-brown/60 max-w-2xl mx-auto">Access the full potential of Culixur with our most exclusive membership tier.</p>
            </div>

            <div class="max-w-xl mx-auto">
                <!-- Monthly Elite -->
                <div class="card-luxury overflow-hidden relative border-brand-gold/50 shadow-2xl">
                    <div class="absolute top-0 right-0 bg-brand-gold text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-bl-xl shadow-sm">Recommended</div>
                    
                    <div class="p-12">
                        <div class="text-center mb-10">
                            <h3 class="font-serif text-3xl font-bold text-brand-brown mb-4">Elite Membership</h3>
                            <div class="flex items-baseline justify-center gap-2 mb-4">
                                <span class="text-4xl font-serif font-bold text-brand-brown">$3,300</span>
                                <span class="text-brand-muted font-bold">/ Month</span>
                            </div>
                            <div class="w-16 h-[1px] bg-brand-gold/30 mx-auto"></div>
                        </div>

                        <ul class="space-y-6 mb-12">
                            <li class="flex items-start text-brand-brown">
                                <svg class="w-5 h-5 text-brand-gold mt-0.5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round"/></svg>
                                <div>
                                    <p class="font-bold text-sm">12 Culinary Orders / Month</p>
                                    <p class="text-xs text-brand-brown/50">Maximum capacity for discerning gourmets.</p>
                                </div>
                            </li>
                            <li class="flex items-start text-brand-brown">
                                <svg class="w-5 h-5 text-brand-gold mt-0.5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round"/></svg>
                                <div>
                                    <p class="font-bold text-sm">Anytime Ordering</p>
                                    <p class="text-xs text-brand-brown/50">No restrictions on booking days or times.</p>
                                </div>
                            </li>
                            <li class="flex items-start text-brand-brown">
                                <svg class="w-5 h-5 text-brand-gold mt-0.5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round"/></svg>
                                <div>
                                    <p class="font-bold text-sm">Priority Booking</p>
                                    <p class="text-xs text-brand-brown/50">First access to Michelin-starred chefs.</p>
                                </div>
                            </li>
                            <li class="flex items-start text-brand-brown">
                                <svg class="w-5 h-5 text-brand-gold mt-0.5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round"/></svg>
                                <div>
                                    <p class="font-bold text-sm">Exclusive Menu Access</p>
                                    <p class="text-xs text-brand-brown/50">Unique dishes crafted only for Elite members.</p>
                                </div>
                            </li>
                        </ul>

                        <form method="POST" action="{{ route('member.upgrade') }}">
                            @csrf
                            <input type="hidden" name="tier" value="ELITE_MONTHLY">
                            <button type="submit" class="w-full bg-brand-burgundy text-white text-xs font-bold uppercase tracking-[0.2em] py-5 rounded-full hover:bg-brand-brown transition-all shadow-xl transform hover:-translate-y-1">
                                Upgrade to Elite Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Current Membership Status -->
            <div class="mt-20 card-luxury p-10 bg-white">
                <h4 class="font-serif text-xl font-bold text-brand-brown mb-8 flex items-center">
                    <svg class="w-5 h-5 text-brand-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="1.5" stroke-linecap="round"/></svg>
                    Your Membership Identity
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div>
                        <p class="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-2">Member Tier</p>
                        <p class="font-bold text-brand-brown">
                            @if(auth()->user()->membership_tier)
                                {{ auth()->user()->membership_tier === 'ELITE_MONTHLY' ? 'Elite Member' : 'Standard Member' }}
                            @else
                                Standard Member
                            @endif
                        </p>
                    </div>
                    <div>
                        <p class="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-2">Member ID</p>
                        <p class="font-serif font-bold text-brand-brown text-lg">{{ auth()->user()->member_id }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] uppercase tracking-widest font-bold text-brand-muted mb-2">Account Status</p>
                        <div class="flex items-center">
                            <div class="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            <p class="text-[10px] font-bold uppercase tracking-widest text-green-600">Active</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
