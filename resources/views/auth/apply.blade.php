<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Culixur') }} - Membership Inquiry</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">

    <!-- CSS -->
    <style>
        :root {
            --brand-brown: #2D1B08;
            --brand-ivory: #F9F7F2;
            --brand-burgundy: #3A090D;
            --brand-gold: #C5A059;
            --brand-muted: #A89F91;
        }
        body { background-color: var(--brand-ivory); color: var(--brand-brown); }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        .card-luxury {
            background: white;
            border: 1px solid rgba(45, 27, 8, 0.05);
            border-radius: 3rem;
            box-shadow: 0 15px 50px rgba(45, 27, 8, 0.04);
        }

        .input-luxury {
            background: rgba(249, 247, 242, 0.5);
            border: 1px solid rgba(45, 27, 8, 0.05);
            border-radius: 1.5rem;
            padding: 1.25rem 1.5rem;
            transition: all 0.3s ease;
            width: 100%;
        }
        .input-luxury:focus {
            outline: none;
            border-color: var(--brand-gold);
            background: white;
            box-shadow: 0 0 20px rgba(197, 160, 89, 0.1);
        }

        .btn-luxury {
            background: var(--brand-burgundy);
            color: white;
            transition: all 0.3s ease;
        }
        .btn-luxury:hover {
            background: var(--brand-brown);
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(45, 27, 8, 0.2);
        }

        .step-content { display: none; }
        .step-content.active { display: block; animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1); }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans antialiased min-h-screen flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1550966842-2849a2202778?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-fixed">
    <div class="absolute inset-0 bg-brand-ivory/95 backdrop-blur-sm"></div>

    <div class="max-w-4xl w-full relative z-10">
        <div class="card-luxury p-10 md:p-16">
            <div class="text-center mb-12">
                <div class="flex justify-center mb-8">
                    <img src="{{ asset('images/logo.png') }}" alt="Culixur" class="h-16">
                </div>
                <h1 class="font-serif text-4xl md:text-5xl font-bold text-brand-brown mb-4">Membership Inquisition</h1>
                <p class="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold">Access to the extraordinary requires precision.</p>
            </div>

            @if(session('success'))
                <div class="mb-8 p-6 bg-green-50 border border-green-100 rounded-3xl text-center">
                    <p class="text-green-700 font-bold text-sm">{{ session('success') }}</p>
                    <a href="{{ url('/') }}" class="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-brand-gold border-b border-brand-gold/30 pb-0.5">Return to Sanctuary</a>
                </div>
            @else
                <form id="apply-form" method="POST" action="{{ route('membership.apply') }}" class="space-y-10">
                    @csrf
                    
                    <!-- Step 1: Identity -->
                    <div id="step-1" class="step-content active">
                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <label class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3 ml-4">First Name</label>
                                <input type="text" name="first_name" class="input-luxury" value="{{ old('first_name') }}" required>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3 ml-4">Last Name</label>
                                <input type="text" name="last_name" class="input-luxury" value="{{ old('last_name') }}" required>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3 ml-4">Email Address</label>
                                <input type="email" name="email" class="input-luxury" value="{{ old('email') }}" required>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3 ml-4">Phone Number</label>
                                <input type="text" name="phone" class="input-luxury" value="{{ old('phone') }}" required>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Elite Credentials -->
                    <div id="step-2" class="step-content">
                        <div class="grid md:grid-cols-2 gap-8">
                            <div class="md:col-span-2">
                                <label class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-4 ml-4">Elite Category</label>
                                <select name="elite_category" class="input-luxury" required>
                                    <option value="">Select Your Sphere</option>
                                    <option value="BUSINESS_LEADER">Business Leader</option>
                                    <option value="INVESTOR">Investor</option>
                                    <option value="ENTREPRENEUR">Entrepreneur</option>
                                    <option value="EXECUTIVE">Executive</option>
                                    <option value="PROFESSIONAL">Professional</option>
                                    <option value="INFLUENCER">Influencer</option>
                                    <option value="CELEBRITY">Celebrity</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3 ml-4">Industry</label>
                                <input type="text" name="industry" class="input-luxury" value="{{ old('industry') }}">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3 ml-4">Position Title</label>
                                <input type="text" name="position_title" class="input-luxury" value="{{ old('position_title') }}">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3 ml-4">Professional Achievements</label>
                                <textarea name="achievements" class="input-luxury h-32" placeholder="Tell us about your legacy (Min. 50 characters)..." required>{{ old('achievements') }}</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Philosophy -->
                    <div id="step-3" class="step-content">
                        <div class="space-y-8">
                            <div>
                                <label class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3 ml-4">Net Worth Range (Verified)</label>
                                <select name="net_worth_range" class="input-luxury" required>
                                    <option value="">Select Range</option>
                                    <option value="UNDER_1M">Under $1M</option>
                                    <option value="1M_5M">$1M - $5M</option>
                                    <option value="5M_20M">$5M - $20M</option>
                                    <option value="20M_PLUS">$20M+</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3 ml-4">Why Culixur?</label>
                                <textarea name="why_elite" class="input-luxury h-40" placeholder="Manifest your expectations of our Elite tier (Min. 50 characters)..." required>{{ old('why_elite') }}</textarea>
                            </div>
                            <div class="flex items-center ml-4">
                                <input type="checkbox" name="terms" id="terms" class="h-4 w-4 text-brand-gold border-brand-brown/10 rounded" required>
                                <label for="terms" class="ml-3 text-[10px] font-bold uppercase tracking-widest text-brand-muted">I accept the Terms of Prestige</label>
                            </div>
                        </div>
                    </div>

                    <!-- Navigation -->
                    <div class="pt-8 border-t border-brand-brown/5 flex justify-between items-center">
                        <button type="button" id="prev-btn" onclick="goToStep(currentStep - 1)" class="hidden text-[10px] font-bold uppercase tracking-widest text-brand-muted hover:text-brand-brown">Previous Section</button>
                        <div class="flex-1"></div>
                        <button type="button" id="next-btn" onclick="goToStep(currentStep + 1)" class="btn-luxury px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">Next Movement</button>
                        <button type="submit" id="submit-btn" class="hidden btn-luxury px-16 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">Submit Inquisition</button>
                    </div>
                </form>
            @endif

            <div class="mt-12 text-center">
                <p class="text-[9px] font-bold text-brand-muted uppercase tracking-[0.3em]">Estimated Review Period: <span class="text-brand-brown">48-72 Hours</span></p>
            </div>
        </div>

        <div class="mt-10 text-center">
            <a href="{{ url('/') }}" class="text-[10px] font-bold uppercase tracking-widest text-brand-brown/40 hover:text-brand-brown transition-colors">&larr; Return to Sanctuary</a>
        </div>
    </div>

    <script>
        let currentStep = 1;
        const totalSteps = 3;

        function goToStep(step) {
            if (step < 1 || step > totalSteps) return;

            // Simple validation before going to next step (optional but good)
            if (step > currentStep) {
                const currentSection = document.getElementById('step-' + currentStep);
                const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
                let valid = true;
                inputs.forEach(input => {
                    if (!input.value) {
                        input.classList.add('border-red-300');
                        valid = false;
                    } else {
                        input.classList.remove('border-red-300');
                    }
                });
                if (!valid) return;
            }

            document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
            document.getElementById('step-' + step).classList.add('active');

            currentStep = step;

            document.getElementById('prev-btn').classList.toggle('hidden', currentStep === 1);
            document.getElementById('next-btn').classList.toggle('hidden', currentStep === totalSteps);
            document.getElementById('submit-btn').classList.toggle('hidden', currentStep !== totalSteps);
        }
    </script>
</body>
</html>
