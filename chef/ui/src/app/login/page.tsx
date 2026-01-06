'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChefHat, Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function ChefLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await authApi.login({ email, password });
            if (data.user.role !== 'CHEF') {
                throw new Error('Access denied. Culinary credentials required.');
            }
            localStorage.setItem('auth_token', data.access_token);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-brown/10 flex items-center justify-center p-6 font-sans">
            <div className="absolute inset-0 bg-brand-ivory opacity-50"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-brown rounded-full mb-6 shadow-xl">
                        <ChefHat className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-brand-brown mb-2">Culinary Portal</h1>
                    <p className="text-brand-gold text-[10px] tracking-[0.3em] uppercase font-black">Secure Artist Access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="bg-white border border-brand-brown/5 rounded-[40px] p-10 shadow-2xl shadow-brand-brown/10">
                        {error && (
                            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-brand-brown/40 uppercase tracking-widest ml-1">Identity (Email)</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-brown/20" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-brand-ivory/30 border border-brand-brown/10 rounded-2xl px-14 py-4 text-sm text-brand-brown focus:outline-none focus:border-brand-gold transition-all"
                                        placeholder="chef@culixur.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-brand-brown/40 uppercase tracking-widest ml-1">Secret (Password)</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-brown/20" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-brand-ivory/30 border border-brand-brown/10 rounded-2xl px-14 py-4 text-sm text-brand-brown focus:outline-none focus:border-brand-gold transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-10 bg-brand-brown text-white font-bold text-[10px] uppercase tracking-[0.3em] py-5 rounded-full hover:bg-brand-burgundy transition-all duration-500 shadow-xl shadow-brand-brown/20 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isLoading ? 'Verifying Identity...' : 'Access Kitchen'}
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-[10px] font-bold text-brand-brown/30 uppercase tracking-[0.4em]">
                    Culixur Artistic Protocol © 2026
                </p>
            </motion.div>
        </div>
    );
}
