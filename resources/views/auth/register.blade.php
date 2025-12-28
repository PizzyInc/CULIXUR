@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-brand-ivory flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div class="text-center">
            <h2 class="font-serif text-3xl font-bold text-gray-900">
                Apply for Elite Membership
            </h2>
            <p class="mt-2 text-sm text-gray-600">
                Join our exclusive culinary community. Application required for approval.
            </p>
        </div>

        @if(session('success'))
            <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-green-700">
                            {{ session('success') }}
                        </p>
                    </div>
                </div>
            </div>
        @endif

        @if($errors->any())
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <ul class="list-disc list-inside text-sm text-red-600">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form class="mt-8 space-y-6" action="{{ route('register') }}" method="POST">
            @csrf
            
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <!-- Personal Info -->
                <div class="col-span-1">
                    <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" name="first_name" id="first_name" required value="{{ old('first_name') }}"
                        class="mt-1 focus:ring-brand-brown focus:border-brand-brown block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-3 px-4 bg-gray-50">
                </div>
                <div class="col-span-1">
                    <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" name="last_name" id="last_name" required value="{{ old('last_name') }}"
                        class="mt-1 focus:ring-brand-brown focus:border-brand-brown block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-3 px-4 bg-gray-50">
                </div>

                <div class="col-span-2">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" name="email" id="email" required value="{{ old('email') }}"
                        class="mt-1 focus:ring-brand-brown focus:border-brand-brown block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-3 px-4 bg-gray-50">
                </div>

                <div class="col-span-1">
                    <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" name="phone" id="phone" required value="{{ old('phone') }}"
                        class="mt-1 focus:ring-brand-brown focus:border-brand-brown block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-3 px-4 bg-gray-50">
                </div>

                <div class="col-span-1">
                    <label for="company" class="block text-sm font-medium text-gray-700">Company (Optional)</label>
                    <input type="text" name="company" id="company" value="{{ old('company') }}"
                        class="mt-1 focus:ring-brand-brown focus:border-brand-brown block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-3 px-4 bg-gray-50">
                </div>

                <!-- Elite Details -->
                <div class="col-span-1">
                    <label for="elite_category" class="block text-sm font-medium text-gray-700">Category</label>
                    <select id="elite_category" name="elite_category" required
                        class="mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-brown focus:border-brand-brown sm:text-sm">
                        <option value="" disabled selected>Select your category</option>
                        <option value="BUSINESS_LEADER">Business Leader</option>
                        <option value="INVESTOR">Investor</option>
                        <option value="ENTREPRENEUR">Entrepreneur</option>
                        <option value="EXECUTIVE">Executive</option>
                        <option value="PROFESSIONAL">Professional</option>
                        <option value="INFLUENCER">Public Figure/Influencer</option>
                        <option value="CELEBRITY">Celebrity</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                
                 <div class="col-span-1">
                    <label for="net_worth_range" class="block text-sm font-medium text-gray-700">Net Worth Range (Private)</label>
                    <select id="net_worth_range" name="net_worth_range" required
                        class="mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-brown focus:border-brand-brown sm:text-sm">
                        <option value="" disabled selected>Select range</option>
                        <option value="<1M">Under $1M</option>
                        <option value="1M-5M">$1M - $5M</option>
                        <option value="5M-10M">$5M - $10M</option>
                        <option value="10M-50M">$10M - $50M</option>
                        <option value="50M+">$50M+</option>
                    </select>
                </div>

                <!-- Essay Questions -->
                <div class="col-span-2">
                    <label for="why_elite" class="block text-sm font-medium text-gray-700">Why do you want to join Culixur? (Min 50 chars)</label>
                    <textarea id="why_elite" name="why_elite" rows="3" required
                        class="mt-1 focus:ring-brand-brown focus:border-brand-brown block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-3 px-4 bg-gray-50">{{ old('why_elite') }}</textarea>
                </div>

                <div class="col-span-2">
                    <label for="achievements" class="block text-sm font-medium text-gray-700">Why do you think you qualify as an elite? (Min 50 chars)</label>
                    <p class="text-xs text-gray-500 mb-1">List relevant achievements, memberships, or background.</p>
                    <textarea id="achievements" name="achievements" rows="3" required
                        class="mt-1 focus:ring-brand-brown focus:border-brand-brown block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-3 px-4 bg-gray-50">{{ old('achievements') }}</textarea>
                </div>
                
                <div class="col-span-2">
                    <label for="referral_code" class="block text-sm font-medium text-gray-700">Referral Code (Optional)</label>
                    <input type="text" name="referral_code" id="referral_code" value="{{ old('referral_code') }}"
                        class="mt-1 focus:ring-brand-brown focus:border-brand-brown block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-3 px-4 bg-gray-50" placeholder="Did a member refer you?">
                </div>

                <div class="col-span-2 flex items-start">
                    <div class="flex items-center h-5">
                        <input id="terms" name="terms" type="checkbox" required class="focus:ring-brand-brown h-4 w-4 text-brand-brown border-gray-300 rounded">
                    </div>
                    <div class="ml-3 text-sm">
                        <label for="terms" class="font-medium text-gray-700">I agree to the <a href="#" class="text-brand-brown hover:text-brand-burgundy">Terms of Service</a> and <a href="#" class="text-brand-brown hover:text-brand-burgundy">Privacy Policy</a></label>
                    </div>
                </div>
            </div>

            <div>
                <button type="submit" class="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-brown hover:bg-brand-burgundy focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown shadow-lg transition-all transform hover:-translate-y-1">
                    Submit Application
                </button>
            </div>
        </form>
    </div>
</div>
@endsection