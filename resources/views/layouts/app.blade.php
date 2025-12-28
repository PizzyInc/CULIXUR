<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Culixur') }} - @yield('title', 'Dashboard')</title>

    <!-- Brand Fonts & Palette -->
    <style>
        :root {
            --brand-brown: #2D1B08;
            --brand-ivory: #F9F7F2;
            --brand-burgundy: #3A090D;
            --brand-crimson: #7A2F35;
            --brand-gold: #C5A059;
            --brand-muted: #A89F91;
        }
        @font-face {
            font-family: 'Futura';
            src: local('Futura'), local('Futura Book');
            font-display: swap;
        }
        body.brand-body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #F9F7F2;
            color: #2D1B08;
        }
        .font-luxury {
            font-family: 'Playfair Display', serif;
        }
        .brand-nav {
            background: rgba(249, 247, 242, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(45, 27, 8, 0.05);
        }
        .brand-btn-primary {
            background-color: #3A090D;
            color: #fff;
            transition: all 0.3s ease;
        }
        .brand-btn-primary:hover { 
            background-color: #2D1B08;
            transform: translateY(-1px);
            box-shadow: 0 10px 20px rgba(45, 27, 8, 0.1);
        }
        .card-luxury {
            background: white;
            border: 1px solid rgba(45, 27, 8, 0.05);
            border-radius: 1rem;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
        }
    </style>

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            brown: '#2D1B08',
                            ivory: '#F9F7F2',
                            burgundy: '#3A090D',
                            crimson: '#7A2F35',
                            gold: '#C5A059',
                            muted: '#A89F91',
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        serif: ['"Playfair Display"', 'serif'],
                    }
                }
            }
        }
    </script>
    
    <!-- Stripe -->
    <script src="https://js.stripe.com/v3/"></script>
</head>
<body class="brand-body antialiased">
    <div class="min-h-screen">
        <!-- Navigation -->
        @include('layouts.navigation')

        <!-- Page Heading -->
        @if (isset($header))
            <header class="bg-white shadow">
                <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {{ $header }}
                </div>
            </header>
        @endif

        <!-- Page Content -->
        <main>
            @yield('content')
        </main>
    </div>

    <!-- Flash Messages -->
    @if (session('success'))
        <div class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {{ session('success') }}
        </div>
    @endif

    @if (session('error'))
        <div class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {{ session('error') }}
        </div>
    @endif

    <script>
        // Auto-hide flash messages
        setTimeout(() => {
            const messages = document.querySelectorAll('.fixed.top-4.right-4');
            messages.forEach(msg => msg.remove());
        }, 5000);
    </script>
</body>
</html>
