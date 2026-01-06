'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChefHat, Upload, Check, AlertCircle } from 'lucide-react';
import { authApi, chefApi } from '@/lib/api';

const CATEGORIES = [
    'Executive Chef',
    'Sous Chef',
    'Commis Chef',
    'Station Chef',
    'Pastry Chef'
];

export default function SetupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        bio: '',
        specialty: '' as string,  // Changed from categories array to single specialty
        image: null as File | null
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Verify user is a chef and needs setup
        const checkAuth = async () => {
            try {
                const user = await authApi.getUser();
                if (user.role !== 'CHEF') {
                    router.push('/login');
                } else if (user.chefProfile?.isComplete) {
                    router.push('/');
                }
            } catch (err) {
                router.push('/login');
            }
        };
        checkAuth();
    }, [router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const selectSpecialty = (specialty: string) => {
        setFormData(prev => ({
            ...prev,
            specialty: specialty  // Set single specialty
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image || !formData.bio || !formData.specialty) {
            setError('Please complete all fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('bio', formData.bio);
            data.append('specialty', formData.specialty);
            data.append('categories', JSON.stringify([formData.specialty]));  // Send as single-item array for compatibility
            data.append('image', formData.image);

            await chefApi.setupProfile(data);
            router.push('/');
        } catch (err) {
            setError('Failed to save profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-ivory flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-[3rem] p-12 shadow-2xl shadow-brand-brown/5 border border-brand-brown/5 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-gold to-brand-brown" />

                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-brand-ivory rounded-3xl mx-auto flex items-center justify-center mb-6">
                        <ChefHat className="w-10 h-10 text-brand-gold" />
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-brand-brown mb-3">Kitchen Command Setup</h1>
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-[0.3em]">Establish Your Culinary Identity</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Image Upload */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted block">Profile Portait</label>
                        <div className="flex items-center gap-8">
                            <div className="w-32 h-32 rounded-3xl bg-brand-ivory border-2 border-dashed border-brand-gold/30 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-brand-gold transition-colors">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-4">
                                        <Upload className="w-6 h-6 text-brand-gold mx-auto mb-2" />
                                        <span className="text-[8px] font-bold text-brand-muted uppercase">Upload</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-serif text-brand-brown mb-2">Upload a professional portrait</p>
                                <p className="text-xs text-brand-muted leading-relaxed">This image will act as your primary identifier across the Culixur network. High resolution, professional attire recommended.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted block">Culinary Specialization (Select One)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => selectSpecialty(cat)}
                                    className={`p-3 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border ${formData.specialty === cat
                                        ? 'bg-brand-brown text-white border-brand-brown shadow-lg shadow-brand-brown/20'
                                        : 'bg-transparent text-brand-muted border-brand-brown/10 hover:border-brand-brown/30'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted block">Executive Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Detail your culinary philosophy, experience, and heritage..."
                            className="w-full h-32 bg-brand-ivory/50 rounded-2xl p-6 text-sm font-serif text-brand-brown placeholder:text-brand-muted/50 border border-transparent focus:border-brand-gold/30 focus:outline-none focus:ring-4 focus:ring-brand-gold/5 transition-all resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-gold text-white py-6 rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-brand-brown transition-all shadow-xl shadow-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            'Initializing Profile...'
                        ) : (
                            <>
                                Initialize Command <Check className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
