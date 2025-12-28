@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">The Gathering Experience</h1>
            <p class="text-xl text-gray-600">Intimate group dining experiences</p>
        </div>
        
        <div class="bg-white rounded-xl shadow-xl overflow-hidden">
            <div class="p-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Service Details</h2>
                
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Included Features</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-center">
                                <svg class="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Group dining coordination
                            </li>
                            <li class="flex items-center">
                                <svg class="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Family-style menu options
                            </li>
                            <li class="flex items-center">
                                <svg class="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Dietary accommodations
                            </li>
                            <li class="flex items-center">
                                <svg class="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Event planning assistance
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
                        <div class="space-y-4">
                            <div class="p-4 border border-gray-200 rounded-lg">
                                <h4 class="font-semibold text-gray-900">Family Gatherings</h4>
                                <p class="text-gray-600 text-sm">Perfect for celebrations</p>
                            </div>
                            <div class="p-4 border border-gray-200 rounded-lg">
                                <h4 class="font-semibold text-gray-900">Friends' Get-Together</h4>
                                <p class="text-gray-600 text-sm">Casual luxury dining</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-8 text-center">
                    <a href="../member/booking/gathering" class="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                        Book This Experience
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection