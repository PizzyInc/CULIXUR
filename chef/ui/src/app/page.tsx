'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChefHat,
    ClipboardList,
    CheckCircle,
    Navigation,
    Clock,
    User,
    MapPin,
    ChevronRight,
    Bell,
    QrCode,
    Scan,
    X,
    ShieldCheck,
    CalendarDays
} from 'lucide-react';
import Link from 'next/link';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { chefApi, authApi, apiRequest } from '@/lib/api';

interface Order {
    id: number;
    order_id: string;
    service_type: string;
    member?: { name: string };
    datetime: string;
    address: string;
    guest_count: number;
    menu?: { name: string };
    status: string;
    total_amount: number;
}

interface AvailabilitySlot {
    date: string;
    startTime: string;
    endTime: string;
}

export default function ChefDashboard() {
    const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed' | 'availability'>('pending');
    const [isScanning, setIsScanning] = useState(false);
    const [scannedMember, setScannedMember] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const user = await authApi.getUser();
                setUserData(user);

                const data = await chefApi.getDashboard();
                setPendingOrders(data.pending);
                setActiveOrders(data.active);
                setCompletedOrders(data.completed);
            } catch (err) {
                console.error("Chef dashboard fetch failed:", err);
                setError('Failed to load dashboard data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    useEffect(() => {
        let scanner: any = null;

        if (isScanning) {
            scanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 200, height: 200 } },
                false
            );

            scanner.render(handleScan, (error: any) => {
                // Ignore failure
            });
        }

        return () => {
            if (scanner) {
                scanner.clear().catch((error: any) => console.error("Failed to clear html5-qrcode scanner. ", error));
            }
        };
    }, [isScanning]);

    const handleStatusUpdate = async (orderId: string | number, status: string) => {
        try {
            await chefApi.updateStatus(orderId, status);
            // Refresh dashboard
            const data = await chefApi.getDashboard();
            setPendingOrders(data.pending);
            setActiveOrders(data.active);
            setCompletedOrders(data.completed);
        } catch (err) {
            console.error("Status update failed:", err);
            alert("Failed to update status.");
        }
    };

    const handleScan = async (decodedText: string) => {
        setIsScanning(true);
        try {
            const data = await chefApi.verifyMember(decodedText);
            if (data.status === 'success') {
                setScannedMember({
                    name: data.member.name,
                    id: data.member.member_id,
                    type: data.member.membership_tier,
                    activeOrder: data.active_order
                });
            } else {
                alert(data.message || "Member not found or no active order.");
            }
        } catch (err) {
            console.error("Verification failed:", err);
            alert("Verification system error.");
        } finally {
            setIsScanning(false);
        }
    };

    const handleSaveAvailability = async () => {
        setIsSaving(true);
        try {
            await chefApi.updateAvailability(availabilitySlots);
            alert("Availability synchronized successfully.");
        } catch (err) {
            console.error("Availability save failed:", err);
            alert("Failed to synchronize availability.");
        } finally {
            setIsSaving(false);
        }
    };

    const addSlot = () => {
        const today = new Date().toISOString().split('T')[0];
        setAvailabilitySlots([...availabilitySlots, { date: today, startTime: '09:00', endTime: '17:00' }]);
    };

    const removeSlot = (index: number) => {
        setAvailabilitySlots(availabilitySlots.filter((_, i) => i !== index));
    };

    const updateSlot = (index: number, field: string, value: string) => {
        const newSlots = [...availabilitySlots];
        newSlots[index] = { ...newSlots[index], [field]: value };
        setAvailabilitySlots(newSlots);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
                <div className="text-brand-brown font-serif italic text-xl animate-pulse">Establishing Command...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-ivory flex">
            {/* Sidebar */}
            <aside className="w-20 md:w-64 bg-brand-brown text-white hidden sm:flex flex-col items-center py-8">
                <Link href="/" className="font-serif text-2xl font-bold mb-12 hidden md:block text-white no-underline">Culixur</Link>
                <div className="font-serif text-2xl font-bold mb-12 md:hidden">C</div>

                <nav className="flex-grow flex flex-col gap-6 w-full px-4">
                    <SidebarLink icon={<ChefHat className="w-5 h-5" />} label="Kitchen Desk" active={activeTab !== 'availability'} onClick={() => setActiveTab('pending')} />
                    <SidebarLink icon={<ClipboardList className="w-5 h-5" />} label="Menus" />
                    <SidebarLink icon={<Clock className="w-5 h-5" />} label="Availability" active={activeTab === 'availability'} onClick={() => setActiveTab('availability')} />
                    <button
                        onClick={() => setIsScanning(true)}
                        className="w-full flex items-center gap-4 py-3 px-3 rounded-2xl transition-all text-brand-gold hover:bg-brand-gold/10"
                    >
                        <Scan className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Verify Member</span>
                    </button>
                </nav>

                <div className="mt-auto">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold border border-brand-gold/30 overflow-hidden">
                        {userData?.image ? (
                            <img src={userData.image} alt={userData.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow">
                <header className="h-24 bg-white border-b border-brand-brown/5 flex items-center justify-between px-8">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-brand-brown">Kitchen Command</h1>
                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Master Chef Portal</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsScanning(true)}
                            className="md:flex items-center gap-2 bg-brand-gold text-white px-4 py-2 rounded-full hidden"
                        >
                            <QrCode className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Verify ID</span>
                        </button>
                        <div className="relative">
                            <Bell className="w-5 h-5 text-brand-brown/40" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-burgundy rounded-full border-2 border-white" />
                        </div>
                        <div className="h-10 w-[1px] bg-brand-brown/5 mx-2" />
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-brand-brown">{userData?.name || 'Chef'}</p>
                            <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">{userData?.chef_profile?.specialty || 'Executive Chef'}</p>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-6xl mx-auto">
                    {/* Section Tabs */}
                    <div className="flex gap-12 border-b border-brand-brown/5 mb-8">
                        <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} label="New Assignments" />
                        <TabButton active={activeTab === 'confirmed'} onClick={() => setActiveTab('confirmed')} label="Confirmed Logistics" />
                        <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} label="Legacy Archive" />
                        <TabButton active={activeTab === 'availability'} onClick={() => setActiveTab('availability')} label="Availability Grid" />
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'pending' && (
                            <motion.div
                                key="pending"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid gap-6"
                            >
                                {pendingOrders.length > 0 ? pendingOrders.map((order) => (
                                    <OrderCard key={order.id} order={order} onUpdate={handleStatusUpdate} />
                                )) : <EmptyState message="No new assignments" />}
                            </motion.div>
                        )}

                        {activeTab === 'confirmed' && (
                            <motion.div
                                key="confirmed"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid gap-6"
                            >
                                {activeOrders.length > 0 ? activeOrders.map((order) => (
                                    <OrderCard key={order.id} order={order} confirmed onUpdate={handleStatusUpdate} />
                                )) : <EmptyState message="No confirmed logistics" />}
                            </motion.div>
                        )}

                        {activeTab === 'completed' && (
                            <motion.div
                                key="completed"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-brand-brown/5 border border-brand-brown/5"
                            >
                                <table className="w-full text-left">
                                    <thead className="bg-brand-ivory/30 border-b border-brand-brown/5">
                                        <tr>
                                            <th className="p-6 text-[10px] font-bold text-brand-muted uppercase tracking-widest">Order</th>
                                            <th className="p-6 text-[10px] font-bold text-brand-muted uppercase tracking-widest">Member</th>
                                            <th className="p-6 text-[10px] font-bold text-brand-muted uppercase tracking-widest">Date</th>
                                            <th className="p-6 text-[10px] font-bold text-brand-muted uppercase tracking-widest text-right">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-brown/5">
                                        {completedOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-brand-ivory/10 transition-colors">
                                                <td className="p-6 text-sm font-serif font-bold text-brand-brown">#{order.order_id}</td>
                                                <td className="p-6 text-xs text-brand-brown">{order.member?.name}</td>
                                                <td className="p-6 text-xs text-brand-muted">{new Date(order.datetime).toLocaleDateString()}</td>
                                                <td className="p-6 text-sm font-bold text-brand-brown text-right">₦{Number(order.total_amount).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {activeTab === 'availability' && (
                            <motion.div
                                key="availability"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-brand-brown/5 border border-brand-brown/5">
                                    <div className="flex justify-between items-end mb-10">
                                        <div>
                                            <h3 className="font-serif text-2xl font-bold text-brand-brown">Availability Grid</h3>
                                            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Personnel Logistics Schedule</p>
                                        </div>
                                        <button
                                            onClick={addSlot}
                                            className="bg-brand-gold text-white px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-brand-brown transition-all shadow-lg shadow-brand-gold/20 flex items-center gap-2"
                                        >
                                            <Clock className="w-3 h-3" /> Add Window
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {availabilitySlots.map((slot, index) => (
                                            <div key={index} className="flex items-center gap-4 bg-brand-ivory/30 p-4 rounded-2xl border border-brand-brown/5">
                                                <div className="flex-grow grid grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-[8px] font-black text-brand-muted uppercase tracking-widest mb-1.5 ml-1">Date</label>
                                                        <input
                                                            type="date"
                                                            value={slot.date}
                                                            onChange={(e) => updateSlot(index, 'date', e.target.value)}
                                                            className="w-full bg-white rounded-xl border-none p-3 text-xs font-bold text-brand-brown focus:ring-1 focus:ring-brand-gold"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[8px] font-black text-brand-muted uppercase tracking-widest mb-1.5 ml-1">Commencement</label>
                                                        <input
                                                            type="time"
                                                            value={slot.startTime}
                                                            onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                                                            className="w-full bg-white rounded-xl border-none p-3 text-xs font-bold text-brand-brown focus:ring-1 focus:ring-brand-gold"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[8px] font-black text-brand-muted uppercase tracking-widest mb-1.5 ml-1">Termination</label>
                                                        <input
                                                            type="time"
                                                            value={slot.endTime}
                                                            onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                                                            className="w-full bg-white rounded-xl border-none p-3 text-xs font-bold text-brand-brown focus:ring-1 focus:ring-brand-gold"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeSlot(index)}
                                                    className="p-3 text-brand-burgundy/40 hover:text-brand-burgundy transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}

                                        {availabilitySlots.length === 0 && (
                                            <div className="py-12 text-center bg-brand-ivory/10 rounded-2xl border border-dashed border-brand-brown/10">
                                                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">No availability windows defined</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-brand-brown/5">
                                        <button
                                            onClick={handleSaveAvailability}
                                            disabled={isSaving}
                                            className="w-full bg-brand-brown text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-brand-brown/20 disabled:opacity-50"
                                        >
                                            {isSaving ? 'Synchronizing Protocols...' : 'Command Synchronize Schedule'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Scanner Overlay */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-brand-brown/95 z-[100] flex items-center justify-center p-8 backdrop-blur-sm"
                    >
                        <div className="max-w-md w-full text-center text-white">
                            <div className="relative w-64 h-64 mx-auto mb-10 border-2 border-brand-gold/30 rounded-[3rem] p-4 group">
                                <div className="absolute inset-0 border-brand-gold rounded-[3rem] border-4 animate-pulse" />
                                <div id="qr-reader" className="w-full h-full bg-slate-900 rounded-[2.5rem] overflow-hidden relative">
                                    <div className="absolute inset-x-0 h-0.5 bg-brand-gold shadow-[0_0_15px_rgba(196,160,82,0.8)] animate-scan z-10" />
                                </div>
                            </div>
                            <h2 className="font-serif text-2xl font-bold mb-4">Verifying Identity</h2>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Align QR code within the frame</p>
                            <button
                                onClick={() => setIsScanning(false)}
                                className="mt-12 text-white/20 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {scannedMember && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 bg-brand-brown/60 z-[110] flex items-center justify-center p-8 backdrop-blur-md"
                    >
                        <div className="bg-white rounded-[3rem] max-w-lg w-full p-12 relative shadow-2xl overflow-hidden text-brand-brown">
                            <div className="absolute top-0 left-0 w-full h-2 bg-brand-gold" />
                            <button onClick={() => setScannedMember(null)} className="absolute top-8 right-8 text-brand-muted hover:text-brand-brown">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-20 h-20 rounded-2xl bg-brand-ivory flex items-center justify-center border border-brand-brown/5">
                                    <User className="w-8 h-8 text-brand-gold" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-2xl font-bold text-brand-brown">{scannedMember.name}</h3>
                                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">{scannedMember.type}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-10 border-y border-brand-brown/5 py-8">
                                <div>
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Pass ID</p>
                                    <p className="text-sm font-serif font-bold text-brand-brown">{scannedMember.id}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Status</p>
                                    <div className="flex items-center gap-1.5 text-green-600">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Verified</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-brand-ivory/50 rounded-2xl p-6 border border-brand-brown/10">
                                <p className="text-[9px] font-bold text-brand-muted uppercase tracking-widest mb-4">Active Experience Log</p>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-brand-brown leading-tight">{scannedMember.activeOrder.menu}</p>
                                        <p className="text-[10px] text-brand-muted font-medium mt-1">Order #{scannedMember.activeOrder.id} • {scannedMember.activeOrder.guests} Guests</p>
                                    </div>
                                    <button className="bg-brand-brown text-white p-2 rounded-lg hover:bg-brand-gold transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setScannedMember(null)}
                                className="w-full mt-10 py-5 bg-brand-brown text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-brown/20 hover:scale-[1.02] transition-transform"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scan {
          0% { top: 10%; }
          100% { top: 90%; }
        }
        .animate-scan {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: #D4AF37;
          box-shadow: 0 0 15px #D4AF37;
          animation: scan 2s linear infinite;
        }
      ` }} />
        </div>
    );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 py-3 px-3 rounded-2xl transition-all ${active ? 'bg-brand-gold/20 text-brand-gold shadow-lg shadow-black/10' : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}>
            <div className="flex-shrink-0">{icon}</div>
            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">{label}</span>
        </button>
    );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${active ? 'text-brand-brown' : 'text-brand-muted transition-colors'
                }`}
        >
            {label}
            {active && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold" />}
        </button>
    );
}

function OrderCard({ order, confirmed = false, onUpdate }: { order: Order, confirmed?: boolean, onUpdate: (id: string | number, status: string) => void }) {
    const isEnRoute = order.status === 'EN_ROUTE';

    return (
        <motion.div
            className="bg-white rounded-3xl p-8 shadow-xl shadow-brand-brown/5 border border-brand-brown/5 flex flex-col md:flex-row items-center gap-8 group hover:border-brand-gold/30 transition-all font-sans"
        >
            <div className="w-full md:w-auto md:flex-grow">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-brand-ivory text-brand-brown text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">#{order.order_id}</span>
                    <span className="bg-brand-gold/10 text-brand-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{order.service_type}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-brand-brown mb-2">{order.member?.name}</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <InfoItem icon={<CalendarDays className="w-3.5 h-3.5 text-brand-gold" />} label="Schedule" value={new Date(order.datetime).toLocaleString()} />
                    <InfoItem icon={<MapPin className="w-3.5 h-3.5 text-brand-gold" />} label="Deployment" value={order.address} />
                    <InfoItem icon={<User className="w-3.5 h-3.5 text-brand-gold" />} label="Distinguished" value={`${order.guest_count} Guests`} />
                    <InfoItem icon={<ChefHat className="w-3.5 h-3.5 text-brand-gold" />} label="Escoffier" value={order.menu?.name || 'Custom Menu'} />
                </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-48">
                {!confirmed ? (
                    <ActionButton
                        icon={<CheckCircle className="w-4 h-4" />}
                        label="Confirm Availability"
                        variant="gold"
                        onClick={() => onUpdate(order.id, 'accepted')}
                    />
                ) : (
                    <>
                        <ActionButton
                            icon={<Navigation className="w-4 h-4" />}
                            label={isEnRoute ? "Currently En-Route" : "Commence En-Route"}
                            variant="brown"
                            disabled={isEnRoute}
                            onClick={() => onUpdate(order.id, 'en_route')}
                        />
                        <ActionButton
                            icon={<CheckCircle className="w-4 h-4" />}
                            label="Mark Fulfilled"
                            variant="success"
                            onClick={() => onUpdate(order.id, 'fulfilled')}
                        />
                    </>
                )}
                <button className="text-[10px] font-bold uppercase tracking-widest text-brand-muted hover:text-brand-brown transition-colors">Digital Folio</button>
            </div>
        </motion.div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="py-20 text-center bg-white/50 rounded-[3rem] border border-dashed border-brand-brown/10">
            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">{message}</p>
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="font-sans">
            <div className="flex items-center gap-1.5 mb-1.5">
                {icon}
                <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-[11px] font-bold text-brand-brown leading-tight">{value}</p>
        </div>
    );
}

function ActionButton({ icon, label, variant, onClick, disabled = false }: { icon: any, label: string, variant: 'gold' | 'brown' | 'success', onClick?: () => void, disabled?: boolean }) {
    const styles = {
        gold: 'bg-brand-gold text-white hover:bg-brand-brown shadow-brand-gold/20',
        brown: 'bg-brand-brown text-white hover:bg-brand-burgundy shadow-brand-brown/20',
        success: 'bg-green-600 text-white hover:bg-green-700 shadow-green-600/20',
    };

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 ${styles[variant]}`}
        >
            {icon} {label}
        </button>
    );
}
