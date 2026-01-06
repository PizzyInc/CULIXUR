'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, UserPlus, Star, Award, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { memberApi } from '@/lib/api';

export default function ReferElitePage() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        occupation: '',
        relationship: '',
        justification: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    useEffect(() => {
        const checkEligibility = async () => {
            try {
                const data = await memberApi.getDashboard();
                if (data.user.membershipTier !== 'ELITE') {
                    // Redirect non-elite members
                    window.location.href = '/dashboard';
                }
            } catch (err) {
                console.error("Eligibility check failed", err);
            }
        };
        checkEligibility();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await memberApi.referElite(formData);
            setIsSubmitted(true);
        } catch (err: any) {
            console.error("Referral failed:", err);
            showToast(err.message || "Referral submission failed. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-8"
                >
                    <div className="w-24 h-24 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-gold/20">
                        <Star className="w-10 h-10 text-brand-gold" />
                    </div>
                    <h2 className="font-serif text-4xl font-bold text-white tracking-tight">Referral Submitted</h2>
                    <p className="text-white/60 leading-relaxed font-light">
                        Thank you for expanding the Culixur network. Your referral has been prioritized and our team will reach out to them shortly with a personal invitation.
                    </p>
                    <div className="pt-8">
                        <Link href="/dashboard" className="inline-block bg-brand-gold text-white text-[10px] font-bold uppercase tracking-widest px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all shadow-xl shadow-brand-gold/20">
                            Return to Dashboard
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-brand-gold selection:text-black">
            {/* Header */}
            <header className="h-24 flex items-center justify-between px-8 border-b border-white/5 sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-gold/50 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-brand-gold" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Back to Portal</span>
                </Link>
                <div className="font-serif text-2xl font-bold text-brand-gold tracking-tighter">
                    Culixur <span className="text-xs uppercase tracking-[0.5em] ml-2 font-sans font-light opacity-50">Elite</span>
                </div>
                <div className="w-24" /> {/* Spacer */}
            </header>

            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left side: Context */}
                    <div className="space-y-8 lg:pr-12">
                        <div className="space-y-4">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.4em] block"
                            >
                                Network Expansion
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-serif text-5xl md:text-6xl font-bold leading-tight"
                            >
                                Refer an <br />
                                <span className="text-brand-gold italic">Elite</span> Member
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-white/60 text-lg font-light leading-relaxed max-w-md"
                            >
                                Do you know someone who embodies the Culixur spirit? Your personal referral bypasses the public queue and receives immediate attention from our review board.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6 pt-4"
                        >
                            {[
                                { icon: ShieldCheck, title: "Priority Review", text: "Referrals are processed within 24 hours." },
                                { icon: Award, title: "Legacy Connection", text: "Strengthen the circle of distinction with high-value peers." },
                                { icon: UserPlus, title: "Exclusive Benefits", text: "Approved referrals grant you additional guest credits." },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-brand-gold/50 transition-colors">
                                        <item.icon className="w-5 h-5 text-brand-gold" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold tracking-wide">{item.title}</h4>
                                        <p className="text-xs text-white/40 font-light">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right side: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/[0.03] border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[100px] pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="First & Last Name" required />
                                <Input label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="e.g. CEO, Investor" required />
                            </div>
                            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="professional@email.com" required />
                            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-brand-gold text-white text-[10px] font-bold uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-brand-gold/10"
                                >
                                    {isSubmitting ? 'Processing Nomination...' : 'Submit Referral Nomination'}
                                    <Check className="w-4 h-4" />
                                </button>
                                <p className="text-center text-[10px] text-white/30 uppercase tracking-widest">
                                    Confidential Priority Submission Protocol
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </main>

            <footer className="h-24 flex items-center justify-center px-8 text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
                Culixur Elite Expansion © 2026
            </footer>

            {/* Toast Notification */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200]">
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`px-8 py-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-4 ${toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : 'bg-brand-brown/90 border-brand-gold/30 text-brand-gold'
                            }`}
                    >
                        <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'error' ? 'bg-white' : 'bg-brand-gold'}`} />
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-4 opacity-50 hover:opacity-100">
                            ×
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function Input({ label, type = 'text', ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block ml-1">{label}</label>
            <input
                type={type}
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-gold/50 transition-all placeholder:text-white/10"
                {...props}
            />
        </div>
    );
}
