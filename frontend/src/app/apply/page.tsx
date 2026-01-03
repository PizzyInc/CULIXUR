'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Star, Shield, Award } from 'lucide-react';
import Link from 'next/link';
import { memberApi } from '@/lib/api';

const steps = [
    { id: 'identity', title: 'Personal Identity', icon: <Star className="w-5 h-5" /> },
    { id: 'status', title: 'Professional Status', icon: <Shield className="w-5 h-5" /> },
    { id: 'legacy', title: 'Legacy & Vision', icon: <Award className="w-5 h-5" /> },
];

export default function ApplyPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        company: '',
        industry: '',
        positionTitle: '',
        eliteCategory: '',
        netWorthRange: '',
        achievements: '',
        whyElite: '',
        membershipTier: 'ELITE',
        referralCode: '',
        message: '',
        terms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleSubmit = async () => {
        if (!formData.terms) {
            alert("Please agree to the privacy protocol.");
            return;
        }
        setIsSubmitting(true);
        try {
            await memberApi.apply(formData);
            setIsSuccess(true);
        } catch (err) {
            console.error("Application submission failed:", err);
            alert("Failed to submit application. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-ivory flex flex-col">
            {/* Navigation */}
            <nav className="h-24 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md border-b border-brand-brown/5 sticky top-0 z-50">
                <Link href="/" className="font-serif text-2xl font-bold text-brand-brown tracking-tighter">
                    Culixur
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep >= idx ? 'bg-brand-brown text-white' : 'bg-brand-brown/10 text-brand-brown/40'
                                }`}>
                                {currentStep > idx ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest font-bold ${currentStep >= idx ? 'text-brand-brown' : 'text-brand-brown/40'
                                }`}>
                                {step.title}
                            </span>
                            {idx < steps.length - 1 && <div className="w-8 h-[1px] bg-brand-brown/10 ml-2" />}
                        </div>
                    ))}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                    Application v1.0
                </div>
            </nav>

            <main className="flex-grow flex items-center justify-center p-4 py-20">
                <div className="max-w-4xl w-full grid md:grid-cols-5 gap-0 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-brand-brown/10 border border-brand-brown/5">
                    {/* Left Panel: Context */}
                    <div className="md:col-span-2 bg-brand-brown p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 border border-white rounded-full" />
                            <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 border border-white rounded-full" />
                        </div>

                        <div className="relative z-10">
                            <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Joining the Elite</span>
                            <h1 className="font-serif text-4xl font-bold leading-tight mb-6">
                                Begin Your <br />
                                <span className="italic">Exquisite</span> Journey
                            </h1>
                            <p className="text-white/60 text-sm leading-relaxed mb-8">
                                Membership at Culixur is by application only. We curate a circle of distinction, where legacy and vision converge.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 text-brand-gold" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold mb-1">Authenticated Access</h4>
                                        <p className="text-xs text-white/50">Exclusive biometric and digital verification for all members.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 pt-12">
                            <div className="flex items-center gap-4 text-xs font-bold text-white/40">
                                <span className="text-brand-gold">Step 0{currentStep + 1}</span>
                                <div className="w-12 h-[1px] bg-white/20" />
                                <span>{steps[currentStep].title}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Form */}
                    <div className="md:col-span-3 p-12 bg-white">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {currentStep === 0 && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                                            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                                        </div>
                                        <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                                            <Input label="Location" name="location" placeholder="City, Country" value={formData.location} onChange={handleChange} />
                                        </div>
                                        <div className="pt-4">
                                            <Select
                                                label="Elite Category"
                                                name="eliteCategory"
                                                value={formData.eliteCategory}
                                                onChange={handleChange}
                                                options={[
                                                    { label: 'Business Leader', value: 'BUSINESS_LEADER' },
                                                    { label: 'Investor', value: 'INVESTOR' },
                                                    { label: 'Entrepreneur', value: 'ENTREPRENEUR' },
                                                    { label: 'Executive', value: 'EXECUTIVE' },
                                                    { label: 'Professional', value: 'PROFESSIONAL' },
                                                    { label: 'Public Figure', value: 'INFLUENCER' },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <Input label="Company / Institution" name="company" value={formData.company} onChange={handleChange} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Industry" name="industry" value={formData.industry} onChange={handleChange} />
                                            <Input label="Position Title" name="positionTitle" value={formData.positionTitle} onChange={handleChange} />
                                        </div>
                                        <Select
                                            label="Estimated Net Worth Range"
                                            name="netWorthRange"
                                            value={formData.netWorthRange}
                                            onChange={handleChange}
                                            options={[
                                                { label: 'Undisclosed / Prestige', value: 'UNDISCLOSED' },
                                                { label: '$1M - $10M', value: '1M-10M' },
                                                { label: '$10M - $100M', value: '10M-100M' },
                                                { label: '$100M+', value: '100M+' },
                                            ]}
                                        />
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <Textarea
                                            label="Key Achievements & Legacy"
                                            placeholder="Describe your significant contributions to your field..."
                                            name="achievements"
                                            value={formData.achievements}
                                            onChange={handleChange}
                                        />
                                        <Textarea
                                            label="Why Culixur?"
                                            placeholder="What does prestige and culinary excellence mean to you?"
                                            name="whyElite"
                                            value={formData.whyElite}
                                            onChange={handleChange}
                                        />
                                        <div className="flex items-center gap-3 p-4 bg-brand-ivory/50 rounded-2xl border border-brand-brown/5">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                name="terms"
                                                checked={formData.terms}
                                                onChange={handleChange}
                                                className="w-4 h-4 rounded border-brand-brown/10 text-brand-brown focus:ring-brand-brown"
                                            />
                                            <label htmlFor="terms" className="text-[10px] font-medium text-brand-brown/60 uppercase tracking-wider leading-none">
                                                I agree to the privacy protocol and terms of exclusivity
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-12 flex justify-between">
                            {currentStep > 0 && (
                                <button
                                    onClick={prevStep}
                                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-brown/60 hover:text-brand-brown transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </button>
                            )}
                            <div className="flex-grow" />
                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="bg-brand-brown text-white text-[10px] font-bold uppercase tracking-widest px-10 py-4 rounded-full flex items-center gap-2"
                                >
                                    Application Received <Check className="w-4 h-4 ml-2" />
                                </motion.div>
                            ) : currentStep < steps.length - 1 ? (
                                <button
                                    onClick={nextStep}
                                    className="bg-brand-brown text-white text-[10px] font-bold uppercase tracking-widest px-10 py-4 rounded-full hover:bg-brand-burgundy transition-all flex items-center gap-2 shadow-xl shadow-brand-brown/20"
                                >
                                    Continue <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="bg-brand-gold text-white text-[10px] font-bold uppercase tracking-widest px-10 py-4 rounded-full hover:bg-brand-brown transition-all flex items-center gap-2 shadow-xl shadow-brand-gold/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Processing Identity...' : 'Submit Application'} <Check className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-8 px-8 flex justify-between text-brand-muted text-[10px] font-bold uppercase tracking-[0.2em]">
                <span>© Culixur 2025</span>
                <span>Invitation Only Protocol</span>
            </footer>
        </div>
    );
}

function Input({ label, type = 'text', ...props }: { label: string, type?: string, [key: string]: any }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest block ml-1">{label}</label>
            <input
                type={type}
                className="w-full bg-brand-ivory/30 border border-brand-brown/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-brown transition-colors"
                {...props}
            />
        </div>
    );
}

function Select({ label, options, ...props }: { label: string, options: { label: string, value: string }[], [key: string]: any }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest block ml-1">{label}</label>
            <select
                className="w-full bg-brand-ivory/30 border border-brand-brown/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-brown transition-colors appearance-none"
                {...props}
            >
                <option value="">Select an option</option>
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

function Textarea({ label, ...props }: { label: string, [key: string]: any }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest block ml-1">{label}</label>
            <textarea
                className="w-full bg-brand-ivory/30 border border-brand-brown/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-brown transition-colors h-32 resize-none"
                {...props}
            />
        </div>
    );
}
