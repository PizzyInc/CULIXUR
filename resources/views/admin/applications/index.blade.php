<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Membership Applications') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    @if($applications->count() > 0)
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Elite Category</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Elite Category</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Elite Qualities</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Worth</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    @foreach($applications as $application)
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {{ $application->first_name }} {{ $application->last_name }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ $application->email }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {{ $application->elite_category_display }}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {{ $application->elite_category_display }}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 text-sm text-gray-600 italic">
                                                "{{ Str::limit($application->why_elite, 30) }}"
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ $application->net_worth_range }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ $application->membership_tier_display }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    @if($application->status === 'PENDING') bg-yellow-100 text-yellow-800
                                                    @elseif($application->status === 'APPROVED') bg-green-100 text-green-800
                                                    @else bg-red-100 text-red-800
                                                    @endif">
                                                    {{ $application->status_display }}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ $application->created_at->format('M j, Y') }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                @if($application->status === 'PENDING')
                                                    <div class="flex space-x-2">
                                                        <button onclick='viewApplication(@json($application))' class="text-blue-600 hover:text-blue-900">View</button>
                                                        <form method="POST" action="{{ route('admin.applications.approve', $application) }}" class="inline">
                                                            @csrf
                                                            <button type="submit" class="text-green-600 hover:text-green-900" onclick="return confirm('Approve this application?')">Approve</button>
                                                        </form>
                                                        <form method="POST" action="{{ route('admin.applications.reject', $application) }}" class="inline">
                                                            @csrf
                                                            <button type="submit" class="text-red-600 hover:text-red-900" onclick="return confirm('Reject this application?')">Reject</button>
                                                        </form>
                                                    </div>
                                                @else
                                                    <span class="text-gray-500">Processed</span>
                                                @endif
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="mt-4">
                            {{ $applications->links() }}
                        </div>
                    @else
                        <div class="text-center py-8">
                            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 class="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                            <p class="mt-1 text-sm text-gray-500">New membership applications will appear here.</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- Application Details Modal -->
    <div id="applicationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
        <div class="relative top-20 mx-auto p-8 border w-11/12 md:w-3/4 lg:w-1/2 shadow-2xl rounded-xl bg-white">
            <div class="mt-0">
                <div class="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 class="text-2xl font-serif font-bold text-gray-900">Application Details</h3>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <!-- Modal Content -->
                <div id="applicationDetailsContent">
                    <!-- Populated by JS -->
                </div>
            </div>
        </div>
    </div>

    <script>
        function viewApplication(app) {
            console.log('Viewing application:', app);
            
            const html = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide">Applicant Name</label>
                        <p class="mt-1 text-lg font-medium text-gray-900">${app.first_name || ''} ${app.last_name || ''}</p>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                        <p class="mt-1 text-lg font-medium text-gray-900">${app.email || 'N/A'}</p>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                        <p class="mt-1 text-lg font-medium text-gray-900">${app.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide">Company</label>
                        <p class="mt-1 text-lg font-medium text-gray-900">${app.company || 'N/A'}</p>
                    </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 class="font-serif text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Elite Profile</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide">Category</label>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">
                                ${app.elite_category || 'N/A'}
                            </span>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide">Net Worth Range</label>
                            <p class="mt-1 text-md font-medium text-gray-900">${app.net_worth_range || 'N/A'}</p>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide">Industry</label>
                            <p class="mt-1 text-md font-medium text-gray-900">${app.industry || 'N/A'}</p>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide">Position</label>
                            <p class="mt-1 text-md font-medium text-gray-900">${app.position_title || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Why do you want to join?</label>
                        <div class="bg-white border border-gray-200 rounded-md p-4 text-gray-700 whitespace-pre-wrap leading-relaxed italic">
                            "${app.why_elite || 'No response provided.'}"
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Qualifications & Achievements</label>
                        <div class="bg-white border border-gray-200 rounded-md p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
                            ${app.achievements || 'No response provided.'}
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Referral Code</label>
                        <p class="text-sm text-gray-600">${app.referral_code || 'None'}</p>
                    </div>
                </div>
            `;

            document.getElementById('applicationDetailsContent').innerHTML = html;
            document.getElementById('applicationModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('applicationModal').classList.add('hidden');
        }
    </script>
</x-app-layout>
