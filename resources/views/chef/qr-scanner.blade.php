<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('QR Code Scanner') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-6xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h2 class="text-2xl font-bold mb-6">QR Code Scanner</h2>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Scanner Section -->
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Scan Member QR Code</h3>
                            <div class="text-center">
                                <div id="scanner-container" class="mb-6">
                                    <video id="video" width="100%" height="300" class="border border-gray-300 rounded-lg"></video>
                                </div>
                                
                                <div id="result" class="hidden">
                                    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                        QR Code scanned successfully!
                                    </div>
                                </div>
                                
                                <div class="space-y-4">
                                    <button id="start-scan" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                                        Start Scanner
                                    </button>
                                    <button id="stop-scan" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded hidden">
                                        Stop Scanner
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Order Details Section -->
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Order Details</h3>
                            <div id="order-details" class="hidden">
                                <div class="bg-gray-50 rounded-lg p-6">
                                    <div class="space-y-4">
                                        <div>
                                            <h4 class="font-semibold text-gray-900">Member Information</h4>
                                            <div id="member-info" class="text-sm text-gray-600"></div>
                                        </div>
                                        
                                        <div>
                                            <h4 class="font-semibold text-gray-900">Service Details</h4>
                                            <div id="service-info" class="text-sm text-gray-600"></div>
                                        </div>
                                        
                                        <div>
                                            <h4 class="font-semibold text-gray-900">Menu & Special Requests</h4>
                                            <div id="menu-info" class="text-sm text-gray-600"></div>
                                        </div>
                                        
                                        <div>
                                            <h4 class="font-semibold text-gray-900">Location & Timing</h4>
                                            <div id="location-info" class="text-sm text-gray-600"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="no-order" class="text-center text-gray-500 py-8">
                                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p>Scan a member's QR code to view order details</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js"></script>
    <script>
        let scanner = null;
        let currentOrder = null;

        document.getElementById('start-scan').addEventListener('click', function() {
            startScanner();
        });

        document.getElementById('stop-scan').addEventListener('click', function() {
            stopScanner();
        });

        function startScanner() {
            document.getElementById('start-scan').classList.add('hidden');
            document.getElementById('stop-scan').classList.remove('hidden');
            
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector('#video'),
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: "environment"
                    }
                },
                decoder: {
                    readers: ["qr_reader"]
                }
            }, function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Initialization finished. Ready to start");
                Quagga.start();
            });

            Quagga.onDetected(function(data) {
                const code = data.codeResult.code;
                console.log('QR Code detected:', code);
                
                // Stop scanner
                Quagga.stop();
                document.getElementById('start-scan').classList.remove('hidden');
                document.getElementById('stop-scan').classList.add('hidden');
                
                // Show result
                document.getElementById('result').classList.remove('hidden');
                
                // Fetch order details
                fetchOrderDetails(code);
            });
        }

        function stopScanner() {
            if (Quagga) {
                Quagga.stop();
            }
            document.getElementById('start-scan').classList.remove('hidden');
            document.getElementById('stop-scan').classList.add('hidden');
        }

        function fetchOrderDetails(qrCode) {
            // Make API call to get order details
            fetch(`/api/verify-member/${qrCode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        displayOrderDetails(data.order);
                    } else {
                        alert('Invalid QR code or no active order found');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error fetching order details');
                });
        }

        function displayOrderDetails(order) {
            document.getElementById('no-order').classList.add('hidden');
            document.getElementById('order-details').classList.remove('hidden');
            
            // Member Information
            document.getElementById('member-info').innerHTML = `
                <p><strong>Name:</strong> ${order.member.name}</p>
                <p><strong>Member ID:</strong> ${order.member.member_id}</p>
                <p><strong>Email:</strong> ${order.member.email}</p>
                <p><strong>Membership:</strong> ${order.member.membership_tier || 'Standard'}</p>
            `;
            
            // Service Details
            document.getElementById('service-info').innerHTML = `
                <p><strong>Service Type:</strong> ${order.service_type}</p>
                <p><strong>Price:</strong> ₦${parseInt(order.price).toLocaleString()}</p>
                <p><strong>Guest Count:</strong> ${order.guest_count}</p>
            `;
            
            // Menu & Special Requests
            document.getElementById('menu-info').innerHTML = `
                <p><strong>Menu:</strong> ${order.menu}</p>
                ${order.allergies ? `<p><strong>Allergies:</strong> ${order.allergies}</p>` : ''}
            `;
            
            // Location & Timing
            document.getElementById('location-info').innerHTML = `
                <p><strong>Date & Time:</strong> ${new Date(order.datetime).toLocaleString()}</p>
                <p><strong>Address:</strong> ${order.address}</p>
            `;
        }
    </script>
</x-app-layout>
