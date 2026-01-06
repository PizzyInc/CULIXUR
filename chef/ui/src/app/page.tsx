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
    CalendarDays,
    LogOut,
    Edit
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed' | 'availability' | 'menus' | 'profile'>('pending');
    const [isScanning, setIsScanning] = useState(false);
    const [scannedMember, setScannedMember] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
    const [menus, setMenus] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);
    const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [editingMenu, setEditingMenu] = useState<any>(null);
    const [editForm, setEditForm] = useState({ name: '', description: '', price: '', img: null as File | null });
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ bio: '', specialty: '', categories: [] as string[], img: null as File | null });

    const CATEGORIES = [
        'Molecular Gastronomy', 'Farm-to-Table', 'Fusion', 'Pastry & Confectionery',
        'Traditional Heritage', 'Avant-Garde', 'Seafood Specialist', 'Vegan & Plant-Based'
    ];

    const handleEditMenu = (menu: any) => {
        setEditingMenu(menu);
        setEditForm({
            name: menu.name,
            description: menu.description,
            price: (menu.fixedPrice || menu.fixed_price || '').toString(),
            img: null
        });
    };

    const handleUpdateMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', editForm.name);
            formData.append('description', editForm.description);
            formData.append('price', editForm.price);
            if (editForm.img) {
                formData.append('image', editForm.img);
            }

            await chefApi.updateMenu(editingMenu.id, formData);

            showToast(`Menu updated successfully.`);
            setEditingMenu(null);
            // Refresh dashboard to get updated menus
            const data = await chefApi.getDashboard();
            setMenus(data.menus || []);
        } catch (err: any) {
            console.error("Menu update failed:", err);
            showToast(`Failed to update menu: ${err.message}`, "error");
        }
    };

    const handleEditProfile = () => {
        setIsEditingProfile(true);
        setProfileForm({
            bio: userData?.chefProfile?.bio || '',
            specialty: userData?.chefProfile?.specialty || '',
            categories: userData?.chefProfile?.categories || [],
            img: null
        });
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('bio', profileForm.bio);
            formData.append('categories', JSON.stringify(profileForm.categories));
            if (profileForm.img) {
                formData.append('image', profileForm.img);
            }
            // Add specialty if backend supports it (it does in my previous verify)

            await chefApi.setupProfile(formData); // Reusing setup which is upsert

            showToast("Profile updated successfully");
            setIsEditingProfile(false);

            // Refresh user data
            const user = await authApi.getUser();
            setUserData(user);
        } catch (err: any) {
            console.error("Profile update failed:", err);
            showToast("Failed to update profile.", "error");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchDashboard = async () => {
            try {
                const user = await authApi.getUser();
                if (user.role !== 'CHEF' && user.role !== 'ADMIN') {
                    router.push('/login');
                    return;
                }

                // Check for profile completion
                if (user.role === 'CHEF' && !user.chefProfile?.isComplete) {
                    router.push('/setup');
                    return;
                }

                setUserData(user);

                const data = await chefApi.getDashboard();
                setPendingOrders(data.pending || []);
                setActiveOrders(data.active || []);
                setCompletedOrders(data.completed || []);
                setMenus(data.menus || []); // Now provided by backend

                // Initialize availability from profile if exists
                if (user.chefProfile) {
                    setIsAvailable(user.chefProfile.isAvailable !== false);
                    setUnavailableDates(user.chefProfile.unavailableDates || []);
                }
            } catch (err: any) {
                console.error("Chef dashboard fetch failed:", err);
                if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
                    localStorage.removeItem('auth_token');
                    router.push('/login');
                } else {
                    setError('Failed to load dashboard data.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, [router]);

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
            // Update local state
            setPendingOrders(prev => prev.filter(o => o.id !== orderId));
            setActiveOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
            showToast(`Order status updated to ${status}`);
            // Refresh dashboard to ensure all lists are updated correctly
            const data = await chefApi.getDashboard();
            setPendingOrders(data.pending);
            setActiveOrders(data.active);
            setCompletedOrders(data.completed);
        } catch (err) {
            console.error("Status update failed:", err);
            showToast("Failed to update status.", "error");
        }
    };

    const handleScan = async (decodedText: string) => {
        setIsScanning(true);
        try {
            const data = await chefApi.verifyMember(decodedText);
            if (data.status === 'success') {
                setScannedMember(data); // Assuming data directly contains member and active_order
            } else {
                showToast(data.message || "Member not found or no active order.", "error");
            }
        } catch (err) {
            console.error("Verification failed:", err);
            showToast("Verification system error.", "error");
        } finally {
            setIsScanning(false);
        }
    };

    const toggleAvailability = () => setIsAvailable(!isAvailable);

    const handleSaveAvailability = async () => {
        setIsSaving(true);
        try {
            const slots = {
                isAvailable,
                unavailableDates: unavailableDates.map(d => new Date(d))
            };
            await chefApi.updateAvailability(slots);
            showToast("Availability synchronized successfully.");
        } catch (err) {
            console.error("Availability save failed:", err);
            showToast("Failed to synchronize availability.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const addUnavailableDate = (date: string) => {
        if (!date || unavailableDates.includes(date)) return;
        setUnavailableDates([...unavailableDates, date].sort());
    };

    const removeUnavailableDate = (date: string) => {
        setUnavailableDates(unavailableDates.filter(d => d !== date));
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
                    <SidebarLink icon={<ChefHat className="w-5 h-5" />} label="Kitchen Desk" active={activeTab !== 'availability' && activeTab !== 'menus' && activeTab !== 'profile'} onClick={() => setActiveTab('pending')} />
                    <SidebarLink icon={<ClipboardList className="w-5 h-5" />} label="Menus" active={activeTab === 'menus'} onClick={() => setActiveTab('menus')} />
                    <SidebarLink icon={<Clock className="w-5 h-5" />} label="Availability" active={activeTab === 'availability'} onClick={() => setActiveTab('availability')} />
                    <SidebarLink icon={<User className="w-5 h-5" />} label="My Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
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
                            <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">{userData?.chefProfile?.specialty || 'Executive Chef'}</p>
                        </div>
                        <div className="h-10 w-[1px] bg-brand-brown/5 mx-2" />
                        <button
                            onClick={() => {
                                localStorage.removeItem('auth_token');
                                router.push('/login');
                            }}
                            className="flex items-center gap-2 p-2 rounded-xl text-brand-brown/40 hover:text-brand-burgundy transition-all"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-6xl mx-auto">
                    {/* Section Tabs */}
                    <div className="flex gap-12 border-b border-brand-brown/5 mb-8">
                        <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} label="New Assignments" />
                        <TabButton active={activeTab === 'confirmed'} onClick={() => setActiveTab('confirmed')} label="Confirmed Logistics" />
                        <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} label="Legacy Archive" />
                        <TabButton active={activeTab === 'menus'} onClick={() => setActiveTab('menus')} label="Curated Menus" />
                        <TabButton active={activeTab === 'availability'} onClick={() => setActiveTab('availability')} label="Availability Grid" />
                        <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} label="My Profile" />
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

                        {activeTab === 'menus' && (
                            <motion.div
                                key="menus"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid md:grid-cols-2 gap-8"
                            >
                                {menus.length > 0 ? menus.map((menu: any) => (
                                    <div key={menu.id} className="bg-white rounded-[2.5rem] p-10 border border-brand-brown/5 shadow-xl shadow-brand-brown/5 group hover:border-brand-gold/30 transition-all font-sans relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8">
                                            <button
                                                onClick={() => handleEditMenu(menu)}
                                                className="p-3 bg-brand-ivory rounded-xl text-brand-muted hover:bg-brand-brown hover:text-white transition-all"
                                                title="Edit Offering"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-16 h-16 bg-brand-ivory rounded-2xl flex items-center justify-center text-brand-gold overflow-hidden flex-shrink-0">
                                                {menu.image ? (
                                                    <img src={menu.image.startsWith('http') ? menu.image : `http://localhost:3001${menu.image}`} alt={menu.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ChefHat className="w-8 h-8" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-serif text-2xl font-bold text-brand-brown">{menu.name}</h4>
                                                <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">{menu.serviceType || 'ATELIER'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Description</p>
                                                <p className="text-sm font-medium text-brand-brown leading-relaxed">{menu.description}</p>
                                            </div>
                                            <div className="pt-6 border-t border-brand-brown/5 flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Standard Rate</p>
                                                    <p className="text-xl font-bold text-brand-brown">₦{Number(menu.fixedPrice || menu.fixed_price).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : <EmptyState message="No menus published" />}
                            </motion.div>
                        )}

                        {activeTab === 'availability' && (
                            <motion.div
                                key="availability"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="bg-white rounded-[2.5rem] p-12 shadow-xl shadow-brand-brown/5 border border-brand-brown/5">
                                    <div className="text-center mb-12">
                                        <h3 className="font-serif text-3xl font-bold text-brand-brown mb-2">Service Protocols</h3>
                                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.3em]">Operational Readiness Management</p>
                                    </div>

                                    {/* Primary Toggle */}
                                    <div className="flex items-center justify-between p-8 bg-brand-ivory/30 rounded-[2rem] border border-brand-brown/5 mb-10 group hover:border-brand-gold/30 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                <ShieldCheck className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h4 className="font-serif text-xl font-bold text-brand-brown">Personnel Availability Status</h4>
                                                <p className="text-[10px] font-medium text-brand-muted mt-1 uppercase tracking-wider">Define overall assignment eligibility</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={toggleAvailability}
                                            className={`relative w-20 h-10 rounded-full transition-all duration-500 p-1.5 ${isAvailable ? 'bg-green-600' : 'bg-slate-300'}`}
                                        >
                                            <div className={`w-7 h-7 bg-white rounded-full shadow-lg transition-all duration-500 transform ${isAvailable ? 'translate-x-10' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <div className="h-[1px] bg-brand-brown/5 mb-10" />

                                    {/* Date Exclusions */}
                                    <div className="grid md:grid-cols-2 gap-12 mb-12">
                                        <div>
                                            <h4 className="font-serif text-lg font-bold text-brand-brown mb-4 flex items-center gap-2">
                                                <CalendarDays className="w-5 h-5 text-brand-gold" />
                                                Specific Off-Days
                                            </h4>
                                            <p className="text-xs text-brand-muted leading-relaxed mb-6">
                                                Block specific dates from your active schedule. These will be synchronized with the central dispatch terminal.
                                            </p>

                                            <div className="flex gap-3">
                                                <input
                                                    type="date"
                                                    id="new-off-day"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="flex-grow bg-brand-ivory/50 rounded-xl border-none p-4 text-xs font-bold text-brand-brown focus:ring-1 focus:ring-brand-gold"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const input = document.getElementById('new-off-day') as HTMLInputElement;
                                                        addUnavailableDate(input.value);
                                                        input.value = '';
                                                    }}
                                                    className="bg-brand-brown text-white px-6 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-4">Current Exclusions</p>
                                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                                {unavailableDates.map(date => (
                                                    <div key={date} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                                                        <span className="text-xs font-bold text-slate-700">{new Date(date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                                        <button
                                                            onClick={() => removeUnavailableDate(date)}
                                                            className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {unavailableDates.length === 0 && (
                                                    <div className="text-center py-8 bg-brand-ivory/10 rounded-xl border border-dashed border-brand-brown/10">
                                                        <p className="text-[9px] font-bold text-brand-muted uppercase tracking-widest">No exclusions logged</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSaveAvailability}
                                        disabled={isSaving}
                                        className="w-full bg-brand-gold text-white py-6 rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-brand-brown transition-all shadow-xl shadow-brand-gold/20 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        {isSaving ? 'Synchronizing Protocols...' : 'Commit Status to Terminal'}
                                    </button>
                                </div>
                            </motion.div>
                        )}


                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="bg-white rounded-[2.5rem] p-12 shadow-xl shadow-brand-brown/5 border border-brand-brown/5 relative overflow-hidden">
                                    <button
                                        onClick={handleEditProfile}
                                        className="absolute top-12 right-12 p-3 bg-brand-ivory rounded-xl text-brand-muted hover:bg-brand-brown hover:text-white transition-all z-10"
                                        title="Edit Profile"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>

                                    <div className="flex flex-col md:flex-row gap-12 items-start">
                                        <div className="w-48 h-48 rounded-[2rem] bg-brand-ivory flex-shrink-0 overflow-hidden border border-brand-brown/5">
                                            {userData?.chefProfile?.image ? (
                                                <img src={userData.chefProfile.image.startsWith('http') ? userData.chefProfile.image : `http://localhost:3001${userData.chefProfile.image}`} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-brand-gold/30">
                                                    <User className="w-16 h-16" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="font-serif text-4xl font-bold text-brand-brown mb-2">{userData?.name}</h2>
                                            <p className="text-xs font-black text-brand-gold uppercase tracking-[0.2em] mb-8">{userData?.chefProfile?.specialty || 'Executive Chef'}</p>

                                            <div className="space-y-8">
                                                <div>
                                                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-3">Bio Narrative</p>
                                                    <p className="text-sm text-brand-brown leading-loose max-w-2xl">{userData?.chefProfile?.bio || 'No bio provided.'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-3">Specializations</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {userData?.chefProfile?.categories?.map((cat: string) => (
                                                            <span key={cat} className="bg-brand-ivory text-brand-brown px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider">{cat}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Scanner & Modals */}
            <AnimatePresence>
                {
                    editingMenu && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-brand-brown/60 z-[120] flex items-center justify-center p-8 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-[3rem] max-w-lg w-full p-12 relative shadow-2xl text-brand-brown"
                            >
                                <button
                                    onClick={() => setEditingMenu(null)}
                                    className="absolute top-8 right-8 p-3 rounded-full bg-brand-ivory text-brand-muted hover:bg-brand-brown hover:text-white transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="mb-10">
                                    <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6">
                                        <Edit className="w-8 h-8 text-brand-gold" />
                                    </div>
                                    <h3 className="font-serif text-3xl font-bold mb-2">Refine Offering</h3>
                                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">Updating: {editingMenu.name}</p>
                                </div>

                                <form onSubmit={handleUpdateMenu} className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-2 block">Menu Identifier</label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-brand-ivory/50 rounded-2xl text-xs font-bold text-brand-brown border-none focus:ring-1 focus:ring-brand-gold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-2 block">Heritage Narrative</label>
                                        <textarea
                                            required
                                            value={editForm.description}
                                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                            className="w-full px-6 py-4 bg-brand-ivory/50 rounded-2xl text-xs font-bold text-brand-brown border-none focus:ring-1 focus:ring-brand-gold h-32 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-2 block">Settlement Value (₦)</label>
                                        <input
                                            type="number"
                                            required
                                            value={editForm.price}
                                            onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                            className="w-full px-6 py-4 bg-brand-ivory/50 rounded-2xl text-xs font-bold text-brand-brown border-none focus:ring-1 focus:ring-brand-gold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-2 block">Update Visual Asset</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setEditForm({ ...editForm, img: e.target.files ? e.target.files[0] : null })}
                                            className="w-full text-[10px] text-brand-muted file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-brand-brown file:text-white hover:file:bg-black transition-all"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-brand-gold text-white py-6 rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] shadow-xl shadow-brand-gold/20 hover:scale-[1.02] transition-transform"
                                    >
                                        Synchronize Changes
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )
                }

                {
                    isEditingProfile && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-brand-brown/60 z-[120] flex items-center justify-center p-8 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-[3rem] max-w-lg w-full p-12 relative shadow-2xl text-brand-brown max-h-[90vh] overflow-y-auto custom-scrollbar"
                            >
                                <button
                                    onClick={() => setIsEditingProfile(false)}
                                    className="absolute top-8 right-8 p-3 rounded-full bg-brand-ivory text-brand-muted hover:bg-brand-brown hover:text-white transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="mb-10">
                                    <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6">
                                        <User className="w-8 h-8 text-brand-gold" />
                                    </div>
                                    <h3 className="font-serif text-3xl font-bold mb-2">Editor's Table</h3>
                                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">Updating Public Profile</p>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-2 block">Bio Narrative</label>
                                        <textarea
                                            required
                                            value={profileForm.bio}
                                            onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                                            className="w-full px-6 py-4 bg-brand-ivory/50 rounded-2xl text-xs font-bold text-brand-brown border-none focus:ring-1 focus:ring-brand-gold h-48 resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-4 block">Specializations</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {CATEGORIES.map(category => (
                                                <button
                                                    key={category}
                                                    type="button"
                                                    onClick={() => {
                                                        const newCats = profileForm.categories.includes(category)
                                                            ? profileForm.categories.filter(c => c !== category)
                                                            : [...profileForm.categories, category];
                                                        setProfileForm({ ...profileForm, categories: newCats });
                                                    }}
                                                    className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all text-center ${profileForm.categories.includes(category)
                                                        ? 'bg-brand-brown text-white shadow-xl shadow-brand-brown/20'
                                                        : 'bg-brand-ivory text-brand-brown hover:bg-brand-brown/5'
                                                        }`}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-2 block">Update Portrait</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setProfileForm({ ...profileForm, img: e.target.files ? e.target.files[0] : null })}
                                            className="w-full text-[10px] text-brand-muted file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-brand-brown file:text-white hover:file:bg-black transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-brand-gold text-white py-6 rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] shadow-xl shadow-brand-gold/20 hover:scale-[1.02] transition-transform"
                                    >
                                        Save Profile
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )
                }

                {
                    isScanning && (
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
                    )
                }

                {
                    scannedMember && (
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
                                    <div className="w-20 h-20 rounded-2xl bg-brand-ivory flex items-center justify-center border border-brand-brown/5 overflow-hidden">
                                        {scannedMember.member.image ? (
                                            <img src={scannedMember.member.image} alt={scannedMember.member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-8 h-8 text-brand-gold" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-2xl font-bold text-brand-brown">{scannedMember.member.name}</h3>
                                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">{scannedMember.member.membership_tier}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-10 border-y border-brand-brown/5 py-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Pass ID</p>
                                        <p className="text-sm font-serif font-bold text-brand-brown">{scannedMember.member.member_id}</p>
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
                                    {scannedMember.active_order ? (
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-bold text-brand-brown leading-tight">{scannedMember.active_order.menu}</p>
                                                <p className="text-[10px] text-brand-muted font-medium mt-1">Order #{scannedMember.active_order.id} • {scannedMember.active_order.guests} Guests</p>
                                            </div>
                                            <button className="bg-brand-brown text-white p-2 rounded-lg hover:bg-brand-gold transition-colors">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-sm font-bold text-brand-muted">No Active Orders</p>
                                            <p className="text-[10px] text-brand-muted/60 mt-1">This member has no pending orchestrations</p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setScannedMember(null)}
                                    className="w-full mt-10 py-5 bg-brand-brown text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-brown/20 hover:scale-[1.02] transition-transform"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-4 ${toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : 'bg-brand-brown/90 border-brand-gold/30 text-brand-gold'
                            }`}
                    >
                        <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'error' ? 'bg-white' : 'bg-brand-gold'}`} />
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-4 opacity-50 hover:opacity-100">
                            <X className="w-4 h-4" />
                        </button>
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
        </div >
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
