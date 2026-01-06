'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function AdminLogin() {
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
            if (data.user.role !== 'ADMIN') {
                throw new Error('Access denied. Administrator privileges required.');
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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-50"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gold rounded-2xl mb-6 shadow-2xl shadow-brand-gold/20">
                        <Lock className="w-8 h-8 text-slate-900" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Systems Oversight</h1>
                    <p className="text-slate-400 text-sm tracking-widest uppercase font-bold">Culixur Administrative Protocol</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-wider">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Terminal ID (Email)</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-14 py-4 text-sm text-white focus:outline-none focus:border-brand-gold/50 transition-all placeholder:text-slate-700"
                                        placeholder="admin@culixur.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Access Cipher (Password)</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-14 py-4 text-sm text-white focus:outline-none focus:border-brand-gold/50 transition-all placeholder:text-slate-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-10 bg-brand-gold text-slate-900 font-bold text-[10px] uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-white transition-all duration-500 shadow-xl shadow-brand-gold/10 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isLoading ? 'Decrypting...' : 'Initialize Session'}
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-[10px] font-bold text-slate-700 uppercase tracking-[0.3em]">
                    Proprietary Systems Oversight © 2026
                </p>
            </motion.div>
        </div>
    );
}
