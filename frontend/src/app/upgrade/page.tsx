'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Check, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

// Placeholder key - in real app, fetch from env or API
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/dashboard`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            {message && <div className="text-red-500 text-xs font-bold">{message}</div>}
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-brand-gold text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all disabled:opacity-50"
            >
                {isLoading ? "Processing..." : "Confirm Subscription"}
            </button>
        </form>
    );
}

export default function UpgradePage() {
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        // Create Subscription Intent
        const token = localStorage.getItem('auth_token');
        fetch('http://localhost:3001/payment/create-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ priceId: 'price_placeholder_elite_monthly' }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const appearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#D4AF37',
            colorBackground: '#ffffff',
            colorText: '#1a1a1a',
        },
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans">
            <header className="h-24 flex items-center justify-between px-8 border-b border-white/5">
                <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-brand-gold transition-colors">
                    Back to Dashboard
                </Link>
                <div className="font-serif text-2xl font-bold text-brand-gold tracking-tighter">
                    Culixur <span className="text-xs uppercase tracking-[0.5em] ml-2 font-sans font-light opacity-50">Elite</span>
                </div>
                <div className="w-24" />
            </header>

            <main className="flex-grow flex items-center justify-center p-8">
                <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div>
                            <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.4em]">Membership Upgrade</span>
                            <h1 className="font-serif text-5xl font-bold mt-4 mb-2">Ascend to <br /><span className="text-brand-gold italic">Elite</span> Status</h1>
                            <p className="text-white/60 text-lg font-light leading-relaxed">
                                Unlock priority bookings, exclusive menu curation, and a dedicated concierge for your culinary lifestyle.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                "Priority Booking Window (48h)",
                                "Concierge Line Access",
                                "Exclusive 'Black Card' Menus",
                                "No Booking Fees"
                            ].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-brand-gold" />
                                    </div>
                                    <span className="text-sm font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <p className="text-3xl font-serif font-bold text-white">₦3,500,000 <span className="text-sm font-sans font-normal text-white/40">/ month</span></p>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Billed Monthly • Cancel Anytime</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem]">
                        {clientSecret ? (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm />
                            </Elements>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-slate-400 font-serif italic animate-pulse">
                                Initializing Secure Gateway...
                            </div>
                        )}
                        <div className="mt-6 flex items-center justify-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3" /> Secure 256-bit SSL Encryption
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
