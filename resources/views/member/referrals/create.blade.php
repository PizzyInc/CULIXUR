<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Make a Referral') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="mb-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Refer an Elite Individual</h3>
                        <p class="text-sm text-gray-600">Help us grow our exclusive community by referring qualified individuals who meet our elite standards.</p>
                    </div>
                    
                    <form method="POST" action="{{ route('member.referrals.store') }}" class="space-y-6">
                        @csrf
                        
                        <!-- Personal Information -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="referred_name" class="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="referred_name" id="referred_name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value="{{ old('referred_name') }}" required>
                                @error('referred_name')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <div>
                                <label for="referred_email" class="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" name="referred_email" id="referred_email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value="{{ old('referred_email') }}" required>
                                @error('referred_email')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>

                        <div>
                            <label for="referred_phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="tel" name="referred_phone" id="referred_phone" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value="{{ old('referred_phone') }}" required>
                            @error('referred_phone')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="referred_occupation" class="block text-sm font-medium text-gray-700">Occupation</label>
                            <input type="text" name="referred_occupation" id="referred_occupation" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value="{{ old('referred_occupation') }}" placeholder="e.g., CEO, Entrepreneur, Executive, etc." required>
                            @error('referred_occupation')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Elite Status -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-3">Elite Status</label>
                            <div class="space-y-3">
                                <label class="flex items-center">
                                    <input type="radio" name="is_elite" value="1" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" {{ old('is_elite') == '1' ? 'checked' : '' }}>
                                    <span class="ml-2 text-sm text-gray-900">Elite Individual - High net worth, executive level, or prominent figure</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="is_elite" value="0" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" {{ old('is_elite') == '0' ? 'checked' : '' }}>
                                    <span class="ml-2 text-sm text-gray-900">Standard Individual - Regular professional or business person</span>
                                </label>
                            </div>
                            @error('is_elite')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="notes" class="block text-sm font-medium text-gray-700">Additional Notes</label>
                            <textarea name="notes" id="notes" rows="4" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Tell us why you think this person would be a good fit for our community...">{{ old('notes') }}</textarea>
                            @error('notes')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-blue-800">Referral Process</h3>
                                    <div class="mt-2 text-sm text-blue-700">
                                        <p>After you submit this referral:</p>
                                        <ul class="list-disc list-inside mt-1 space-y-1">
                                            <li>We will review the person's qualifications</li>
                                            <li>If approved, we will contact them directly</li>
                                            <li>You will be notified of the outcome</li>
                                            <li>Successful referrals may earn rewards</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3">
                            <a href="{{ route('member.referrals.index') }}" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                                Cancel
                            </a>
                            <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                                Submit Referral
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
