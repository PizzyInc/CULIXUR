<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Culixur - Chef Portal Login</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            brown: '#402A10',
                            ivory: '#D9D6D1',
                            burgundy: '#410A0F',
                            crimson: '#8C3A40',
                            mauve: '#A67885',
                        }
                    },
                    fontFamily: {
                        sans: ['"Futura Book"', 'Futura', 'sans-serif'],
                        serif: ['Playfair Display', 'serif'],
                    }
                }
            }
        }
    </script>
    <style>
        .brand-brown { color: #402A10; }
        .bg-brand-ivory { background-color: #D9D6D1; }
        .bg-brand-burgundy { background-color: #410A0F; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Futura Book', 'Futura', sans-serif; }
        @font-face {
            font-family: 'Futura';
            src: local('Futura'), local('Futura Book');
            font-display: swap;
        }
    </style>
</head>
<body class="bg-brand-ivory font-sans h-screen flex items-center justify-center">

    <div class="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div class="text-center mb-8">
            <div class="flex justify-center mb-4">
                <img class="h-16" src="{{ asset('images/logo.png') }}" alt="Culixur Logo">
            </div>
            <h1 class="font-serif text-3xl font-bold text-gray-900 mb-2">Chef Portal</h1>
            <p class="text-gray-500 text-sm">Enter your Chef ID to manage your culinary bookings.</p>
        </div>

        <form method="POST" action="{{ route('chef.login.store') }}">
            @csrf

            <!-- Chef ID -->
            <div class="mb-6">
                <label for="chef_id" class="block text-sm font-medium text-gray-700 mb-2">Chef ID</label>
                <input id="chef_id" type="text" name="chef_id" value="{{ old('chef_id') }}" required autofocus
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#402A10] focus:border-[#402A10] transition-colors"
                    placeholder="e.g. CHEF-123456">
                @error('chef_id')
                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Passphrase -->
            <div class="mb-8">
                <label for="passphrase" class="block text-sm font-medium text-gray-700 mb-2">Passphrase</label>
                <input id="passphrase" type="password" name="passphrase" required
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#402A10] focus:border-[#402A10] transition-colors"
                    placeholder="••••••••">
                @error('passphrase')
                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <button type="submit" class="w-full bg-brand-burgundy text-white font-bold py-3.5 rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Access Portal
            </button>
        </form>

        <div class="mt-8 text-center border-t border-gray-100 pt-6">
            <a href="/" class="text-sm text-gray-500 hover:text-gray-900 font-medium">← Back to Home</a>
        </div>
    </div>

</body>
</html>
