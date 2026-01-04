'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu as MenuIcon,
    User as UserIcon,
    Calendar,
    Plus,
    CreditCard,
    Settings,
    ChevronRight,
    X,
    Star,
    UtensilsCrossed,
    QrCode
} from 'lucide-react';
import { memberApi } from '@/lib/api';

export default function Dashboard() {
    const [isElite, setIsElite] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await memberApi.getDashboard();
                setUserData(data.user);
                setOrders(data.orders);
                setUpcomingEvents(data.upcomingEvents);
                setIsElite(data.user.membershipTier === 'ELITE');
            } catch (err) {
                console.error("Dashboard fetch failed:", err);
                // Fallback or error state
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
                <div className="text-brand-brown font-serif italic text-xl animate-pulse">Orchestrating Experience...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-ivory relative">
            {/* Upgrade Modal */}
            <AnimatePresence>
                {showUpgradeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden relative shadow-2xl"
                        >
                            <button
                                onClick={() => setShowUpgradeModal(false)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-brand-ivory hover:bg-brand-brown/5 transition-colors"
                            >
                                <X className="w-5 h-5 text-brand-brown" />
                            </button>

                            <div className="p-10">
                                <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6">
                                    <Star className="w-8 h-8 text-brand-gold" />
                                </div>
                                <h3 className="font-serif text-3xl font-bold text-brand-brown mb-2">Elevate to Elite</h3>
                                <p className="text-brand-muted text-sm leading-relaxed mb-8">
                                    Join our most exclusive tier and redefine your culinary journey with unrestricted access and bespoke privileges.
                                </p>

                                <div className="space-y-4 mb-10">
                                    <BenefitItem icon={<Calendar className="w-4 h-4" />} text="High Priority Booking & Assignment" />
                                    <BenefitItem icon={<UtensilsCrossed className="w-4 h-4" />} text="Up to 15 Orders per Month" />
                                    <BenefitItem icon={<Plus className="w-4 h-4" />} text="Exclusive Invites to Elite-only Events" />
                                </div>

                                <div className="bg-brand-ivory/50 rounded-2xl p-6 mb-8 border border-brand-brown/5">
                                    <div className="flex justify-between items-center text-brand-brown">
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Elite Subscription Fee</span>
                                        <span className="font-serif text-2xl font-bold">$3,500<span className="text-xs">/mo</span></span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setIsElite(true);
                                        setShowUpgradeModal(false);
                                    }}
                                    className="w-full bg-brand-brown text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all shadow-xl shadow-brand-brown/20"
                                >
                                    Confirm Upgrade
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dashboard Nav */}
            <nav className="bg-white border-b border-brand-brown/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/" className="flex items-center gap-2 group">
                                    <div className="w-8 h-[1px] bg-brand-gold opacity-40 group-hover:w-12 transition-all"></div>
                                    <span className="font-serif text-2xl font-bold text-brand-brown tracking-widest uppercase">Culixur</span>
                                    <div className="w-8 h-[1px] bg-brand-gold opacity-40 group-hover:w-12 transition-all"></div>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="hidden md:flex ml-4 items-center space-x-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-brand-brown/60">Welcome, {userData?.name || 'Member'}</span>
                                <div className="h-8 w-8 rounded-full bg-brand-brown/10 flex items-center justify-center">
                                    <UserIcon className="h-4 w-4 text-brand-brown" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <header className="bg-white shadow-sm border-b border-brand-brown/5 relative z-10">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <h2 className="font-serif font-bold text-2xl text-brand-brown leading-tight">
                        Member Dashboard
                    </h2>
                </div>
            </header>

            <main className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Profile & Account Status */}
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        {/* Member Card */}
                        <div className={`rounded-3xl p-8 text-white transition-all duration-700 shadow-2xl relative overflow-hidden md:col-span-2 group ${isElite ? 'bg-[#1A1A1A] shadow-black/40' : 'bg-[#5D2A2C] shadow-brand-burgundy/40'}`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-gold/10 rounded-full -ml-16 -mb-16 blur-2xl" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 p-1 flex-shrink-0 relative group">
                                        <div className="relative w-full h-full rounded-xl overflow-hidden bg-brand-brown/50">
                                            <Image
                                                src={userData?.image || `https://ui-avatars.com/api/?name=${userData?.name || 'Member'}&background=654321&color=fff`}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <button className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] font-bold uppercase">Update</button>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 justify-end text-brand-gold mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Member ID</span>
                                        </div>
                                        <p className="font-serif text-xl font-bold tracking-widest uppercase">{userData?.memberId || 'CUL-XXXXXX'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-serif text-3xl font-bold mb-1">{userData?.name || 'Valued Member'}</h3>
                                    <p className="text-white/40 text-xs font-medium lowercase tracking-wider mb-6">{userData?.email}</p>

                                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em]">
                                        {isElite ? 'Elite Member' : 'Culixur Member'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Digital Verification (QR) */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-brand-brown/5 border border-brand-brown/5 flex flex-col items-center justify-between group">
                            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-4">Digital Pass</span>
                            <div className="w-32 h-32 bg-brand-ivory rounded-2xl p-4 border border-brand-brown/5 group-hover:border-brand-gold transition-colors relative overflow-hidden">
                                {userData?.memberId ? (
                                    <Image
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${userData.memberId}`}
                                        alt="Member QR"
                                        width={100}
                                        height={100}
                                        className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-brand-muted">
                                        <QrCode className="w-8 h-8 opacity-20" />
                                    </div>
                                )}
                            </div>
                            <p className="text-[9px] text-brand-muted font-bold uppercase tracking-widest mt-4 text-center leading-relaxed">
                                Scan at service <br /> for verification
                            </p>
                        </div>

                        {/* Order Counter / Action */}
                        <div className={`rounded-3xl p-8 flex flex-col justify-between text-white shadow-xl transition-all duration-700 ${isElite ? 'bg-black shadow-black/20' : 'bg-[#5D2A2C] shadow-brand-burgundy/40'}`}>
                            <div>
                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-2 block">Allocated Services</span>
                                {isElite ? (
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-serif text-5xl font-bold">{orders.length}</span>
                                        <span className="text-white/40 font-bold">/ 15</span>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <p className="text-lg font-serif font-bold leading-tight mb-4">Elevate your access</p>
                                        <button
                                            onClick={() => setShowUpgradeModal(true)}
                                            className="bg-brand-gold text-white text-[9px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-full hover:bg-white hover:text-brand-brown transition-all shadow-lg shadow-brand-gold/20"
                                        >
                                            Request Elite
                                        </button>
                                    </div>
                                )}
                            </div>
                            <Link href="/book" className="text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:text-white transition-colors mt-6 flex items-center gap-2">
                                Orchestrate New Experience <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <ActionCard icon={<Plus className="w-6 h-6" />} label="New Booking" href="/book" />
                        <ActionCard icon={<UserIcon className="w-6 h-6" />} label="Refer an Elite" href="/refer-elite" />
                        <ActionCard icon={<CreditCard className="w-6 h-6" />} label="Financial Ledger" href="/ledger" disabled />
                        <ActionCard icon={<Settings className="w-6 h-6" />} label="Protocol Settings" href="/settings" disabled />
                    </div>

                    {/* Recent Orchestrations */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-brand-brown/5 border border-brand-brown/5 overflow-hidden">
                        <div className="p-10">
                            <div className="flex justify-between items-end mb-10">
                                <div>
                                    <h3 className="font-serif text-2xl font-bold text-brand-brown">Recent Orchestrations</h3>
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Service History</p>
                                </div>
                                <button className="text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:text-brand-brown transition-colors">Export Ledger</button>
                            </div>
                            {orders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-brand-brown/5">
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-brand-muted uppercase tracking-widest">Tracking ID</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-brand-muted uppercase tracking-widest">Logistics Tier</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-brand-muted uppercase tracking-widest">Deployment</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-bold text-brand-muted uppercase tracking-widest">Settlement</th>
                                                <th className="px-6 py-4 text-right text-[10px] font-bold text-brand-muted uppercase tracking-widest">Lifecycle</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand-brown/5">
                                            {orders.map((order) => (
                                                <tr key={order.id} className="group hover:bg-brand-ivory/30 transition-colors">
                                                    <td className="px-6 py-6 whitespace-nowrap text-sm font-serif font-bold text-brand-brown">#{order.id}</td>
                                                    <td className="px-6 py-6 whitespace-nowrap text-xs font-semibold text-brand-brown">{order.service_type}</td>
                                                    <td className="px-6 py-6 whitespace-nowrap text-xs text-brand-brown/60 uppercase tracking-tighter">{new Date(order.datetime).toLocaleDateString()}</td>
                                                    <td className="px-6 py-6 whitespace-nowrap text-sm font-bold text-brand-brown">₦{Number(order.price).toLocaleString()}</td>
                                                    <td className="px-6 py-6 whitespace-nowrap text-right">
                                                        <StatusBadge status={order.status} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-brand-ivory/20 rounded-3xl border border-dashed border-brand-brown/10">
                                    <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest">No service logs available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ActionCard({ icon, label, href, disabled }: { icon: any, label: string, href: string, disabled?: boolean }) {
    if (disabled) {
        return (
            <div className="bg-white rounded-2xl p-6 text-center opacity-50 cursor-not-allowed border border-brand-brown/5">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    {icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
            </div>
        );
    }
    return (
        <Link href={href} className="bg-white rounded-2xl p-6 text-center border border-brand-brown/5 hover:border-brand-gold hover:shadow-lg hover:shadow-brand-gold/10 group transition-all duration-300">
            <div className="w-12 h-12 bg-brand-ivory rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-brand-gold/10 transition-transform">
                <div className="text-brand-brown group-hover:text-brand-gold transition-colors">
                    {icon}
                </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-brown group-hover:text-brand-gold transition-colors">{label}</span>
        </Link>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
        COMPLETED: "bg-gray-50 text-gray-600 border-gray-200",
        CANCELLED: "bg-red-50 text-red-700 border-red-200",
    }[status] || "bg-brand-gold/10 text-brand-gold border-brand-gold/20";

    return (
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles}`}>
            {status}
        </span>
    );
}

function BenefitItem({ icon, text }: { icon: any, text: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="w-8 h-8 rounded-full bg-brand-brown/5 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <span className="text-sm font-medium text-brand-brown opacity-80">{text}</span>
        </div>
    );
}
