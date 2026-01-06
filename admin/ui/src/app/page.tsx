'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Package,
    ChefHat,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Search,
    Filter,
    CheckCircle2,
    X,
    LayoutDashboard,
    Key,
    Database,
    UtensilsCrossed,
    Plus,
    Edit,
    UserPlus,
    Trash2,
    Image as ImageIcon,
    User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi, authApi } from '@/lib/api';

type AdminTab = 'overview' | 'authorization' | 'bookings' | 'menus' | 'chefs';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchDashboard = async () => {
            try {
                const data = await adminApi.getDashboard();
                setDashboardData(data);
            } catch (err: any) {
                console.error("Admin dashboard fetch failed:", err);
                if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
                    localStorage.removeItem('auth_token');
                    router.push('/login');
                } else {
                    setError('Failed to load operations data.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, [router]);

    const handleApproveApp = async (id: string | number) => {
        try {
            await adminApi.approveApplication(id);
            alert("Application approved successfully.");
            // Refresh
            const data = await adminApi.getDashboard();
            setDashboardData(data);
        } catch (err) {
            console.error("Approval failed:", err);
            alert("Failed to approve application.");
        }
    };

    const handleRejectApp = async (id: string | number) => {
        if (!confirm("Are you sure you want to reject this application?")) return;
        try {
            await adminApi.rejectApplication(id);
            alert("Application rejected.");
            // Refresh
            const data = await adminApi.getDashboard();
            setDashboardData(data);
        } catch (err) {
            console.error("Rejection failed:", err);
            alert("Failed to reject application.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-900 font-serif italic text-xl animate-pulse">Synchronizing Operations...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Admin Sidebar */}
            <aside className="w-68 bg-slate-900 text-white flex flex-col p-8 sticky top-0 h-screen font-sans">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center shadow-lg shadow-brand-gold/20">
                        <span className="font-serif font-black text-slate-900 italic text-xl">C</span>
                    </div>
                    <Link href="/" className="no-underline text-white">
                        <div>
                            <span className="font-serif text-xl font-bold tracking-tight block leading-none">Culixur</span>
                            <span className="text-[9px] text-brand-gold uppercase font-black tracking-[0.2em] mt-1 block">Systems Oversight</span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-grow space-y-3">
                    <AdminSidebarLink icon={<LayoutDashboard className="w-4 h-4" />} label="Command Center" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <AdminSidebarLink icon={<Key className="w-4 h-4" />} label="Authorization" active={activeTab === 'authorization'} onClick={() => setActiveTab('authorization')} />
                    <AdminSidebarLink icon={<Package className="w-4 h-4" />} label="Manage Bookings" active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
                    <AdminSidebarLink icon={<UtensilsCrossed className="w-4 h-4" />} label="Manage Menus" active={activeTab === 'menus'} onClick={() => setActiveTab('menus')} />
                    <div className="pt-6 pb-2 px-4">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Analytics</span>
                    </div>
                    <AdminSidebarLink icon={<BarChart3 className="w-4 h-4" />} label="Financial Insights" />
                    <AdminSidebarLink icon={<Database className="w-4 h-4" />} label="System Logs" />
                </nav>

                <div className="pt-8 border-t border-white/10 mt-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden ring-2 ring-brand-gold/20">
                                <img src="https://ui-avatars.com/api/?name=Admin+Hub&background=020617&color=fff" alt="Admin" />
                            </div>
                            <div>
                                <p className="text-xs font-bold">Systems Admin</p>
                                <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest mt-0.5">Global Controller</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('auth_token');
                                window.location.href = '/login';
                            }}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <span className="sr-only">Logout</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-12">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                            {activeTab === 'overview' && 'Operations Hub'}
                            {activeTab === 'authorization' && 'Access Control'}
                            {activeTab === 'bookings' && 'Logistics Management'}
                            {activeTab === 'menus' && 'Curated Offerings'}
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">Monitoring the pulse of Culixur global operations.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Global search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs w-72 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="pl-11 pr-10 py-4 bg-slate-900 text-white border-none rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all shadow-lg shadow-slate-900/10 appearance-none cursor-pointer font-bold"
                            >
                                <option value="ALL">All Identities</option>
                                <option value="MEMBER">Members Only</option>
                                <option value="CHEF">Chefs Only</option>
                            </select>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            key="overview"
                            data={dashboardData}
                            onApprove={handleApproveApp}
                            onReject={handleRejectApp}
                            searchTerm={searchTerm}
                        />
                    )}
                    {activeTab === 'authorization' && (
                        <AuthorizationTab
                            key="auth"
                            onRefresh={() => adminApi.getUsers()}
                            searchTerm={searchTerm}
                            filterCategory={filterCategory}
                        />
                    )}
                    {activeTab === 'bookings' && (
                        <BookingsTab
                            key="bookings"
                            searchTerm={searchTerm}
                        />
                    )}
                    {activeTab === 'menus' && (
                        <MenusTab
                            key="menus"
                            searchTerm={searchTerm}
                        />
                    )}
                    {activeTab === 'chefs' && (
                        <ChefsTab key="chefs" />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

interface OverviewTabProps {
    data: {
        stats: {
            live_orders: number;
            active_chefs: number;
            review_queue: number;
            aov: number;
        };
        recent_logistics: any[];
        pending_applications: any[];
    };
    onApprove: (id: string | number) => void;
    onReject: (id: string | number) => void;
    searchTerm: string;
}

function OverviewTab({ data, onApprove, onReject, searchTerm }: OverviewTabProps) {
    if (!data) return null;

    const stats = data.stats;
    const [isQueueOpen, setIsQueueOpen] = useState(false);
    const [allApps, setAllApps] = useState<any[]>([]);
    const [isActiveChefsOpen, setIsActiveChefsOpen] = useState(false);
    const [activeChefs, setActiveChefs] = useState<any[]>([]);

    const fetchQueue = async () => {
        try {
            const res = await adminApi.getAllApplications();
            setAllApps(res);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchActiveChefs = async () => {
        try {
            const res = await adminApi.getUsers();
            // Filter only chefs
            const chefs = res.filter((u: any) => u.role === 'CHEF');
            setActiveChefs(chefs);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Live Orders" value={stats.live_orders} trend="+2" trendType="up" />
                <StatCard
                    label="Active Chefs"
                    value={stats.active_chefs}
                    trend="0"
                    trendType="neutral"
                    onClick={() => { setIsActiveChefsOpen(true); fetchActiveChefs(); }}
                    className="cursor-pointer hover:border-brand-gold transition-colors"
                />
                <StatCard label="Review Queue" value={stats.review_queue} trend="+5" trendType="up" />
                <StatCard label="AOV (Avg)" value={`₦${Math.round(stats.aov / 1000)}k`} trend="+12%" trendType="up" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="font-serif text-2xl font-bold">Active Logistics</h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Full Stack</button>
                    </div>
                    <div className="space-y-8">
                        {data.recent_logistics?.filter((order: any) =>
                            order.member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.order_id?.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((order: any) => (
                            <OverviewOrder
                                key={order.id}
                                id={order.order_id}
                                member={order.member?.name}
                                status={order.status}
                                price={`₦${(order.price / 1000000).toFixed(1)}M`}
                            />
                        ))}
                        {(!data.recent_logistics || data.recent_logistics.length === 0) && (
                            <p className="text-xs text-slate-400 italic">No active logistics</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="font-serif text-2xl font-bold">Pending Approval</h3>
                        <button
                            onClick={() => { setIsQueueOpen(true); fetchQueue(); }}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            Queue
                        </button>
                    </div>
                    <div className="space-y-8">
                        {data.pending_applications?.filter((app: any) =>
                            `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            app.membershipTier?.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((app: any) => (
                            <OverviewApp
                                key={app.id}
                                app={app}
                                onApprove={onApprove}
                                onReject={onReject}
                            />
                        ))}
                        {(!data.pending_applications || data.pending_applications.length === 0) && (
                            <p className="text-xs text-slate-400 italic">No pending applications</p>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isQueueOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-serif text-2xl font-bold">Application Queue</h3>
                                <button onClick={() => setIsQueueOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors font-sans">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {allApps.map((app: any) => (
                                    <OverviewApp
                                        key={app.id}
                                        app={app}
                                        onApprove={(id) => { onApprove(id); setIsQueueOpen(false); }}
                                        onReject={(id) => { onReject(id); setIsQueueOpen(false); }}
                                    />
                                ))}
                                {allApps.length === 0 && <p className="text-center text-slate-400 italic">No applications found.</p>}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isActiveChefsOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-serif text-2xl font-bold">Personnel Status Monitor</h3>
                                <button onClick={() => setIsActiveChefsOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {activeChefs.map((chef: any) => {
                                    const isAvailable = chef.chefProfile?.isAvailable !== false;
                                    const unavailableDates = chef.chefProfile?.unavailableDates || [];
                                    return (
                                        <div key={chef.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                                    {chef.name?.[0] || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{chef.name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                                        {isAvailable ? 'Operational' : 'Off-Duty'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-[9px] font-black px-3 py-1 rounded-full border ${isAvailable ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                                    {isAvailable ? 'ON STANDBY' : 'UNAVAILABLE'}
                                                </div>
                                                {unavailableDates.length > 0 && (
                                                    <p className="text-[8px] font-bold text-slate-400 mt-2">
                                                        {unavailableDates.length} Scheduled Off-Days
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {activeChefs.length === 0 && <p className="text-center text-slate-400 italic py-10">No chefs currently registered in terminal.</p>}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function AuthorizationTab({ onRefresh, searchTerm, filterCategory }: { onRefresh: () => Promise<any>, searchTerm: string, filterCategory: string }) {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingChef, setIsCreatingChef] = useState(false);
    const [isCreatingMember, setIsCreatingMember] = useState(false);
    const [newChef, setNewChef] = useState({ name: '', email: '', password: '', role: 'CHEF' });
    const [newMember, setNewMember] = useState({ memberId: '', name: '', email: '', passphrase: '', role: 'MEMBER' });
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEditingUser, setIsEditingUser] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await onRefresh();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateChef = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApi.createChef(newChef);
            alert("Chef created successfully.");
            setIsCreatingChef(false);
            setNewChef({ name: '', email: '', password: '', role: 'CHEF' });
            fetchUsers();
        } catch (err) {
            console.error("Chef creation failed:", err);
            alert("Failed to create chef.");
        }
    };

    const handleCreateMember = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApi.createMember(newMember);
            alert("Member inducted successfully.");
            setIsCreatingMember(false);
            setNewMember({ memberId: '', name: '', email: '', passphrase: '', role: 'MEMBER' });
            fetchUsers();
        } catch (err) {
            console.error("Member induction failed:", err);
            alert("Failed to induct member.");
        }
    };

    const handleEditUser = (user: any) => {
        setSelectedUser(user);
        setIsEditingUser(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        try {
            await adminApi.updateUser(selectedUser.id, selectedUser);
            alert("User updated successfully.");
            setIsEditingUser(false);
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert("Failed to update user.");
        }
    };

    const handleDeleteUser = async (user: any) => {
        if (!confirm(`Are you sure you want to remove ${user.name}? This action cannot be undone.`)) return;
        try {
            await adminApi.deleteUser(user.id);
            alert(`${user.name} has been removed.`);
            fetchUsers();
        } catch (err) {
            console.error("Failed to remove user:", err);
            alert("Failed to remove user.");
        }
    };

    const handleSyncUsers = async () => {
        if (!confirm("This will synchronize all existing users to ensure they have correct membership tiers and system IDs. Proceed?")) return;
        try {
            const res = await adminApi.syncUsers();
            alert(res.message);
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert("Sync failed.");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-200">
                <div>
                    <h3 className="font-serif text-xl font-bold mb-1">Credential Master</h3>
                    <p className="text-xs text-slate-400">Mint new member IDs and chef passphrases.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSyncUsers}
                        className="flex items-center gap-2 bg-slate-100 text-slate-600 hover:bg-slate-200 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                        <Database className="w-4 h-4" /> Sync Users
                    </button>
                    <button
                        onClick={() => setIsCreatingMember(true)}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-slate-900/20"
                    >
                        <UserPlus className="w-4 h-4" /> New Member
                    </button>
                    <button
                        onClick={() => setIsCreatingChef(true)}
                        className="flex items-center gap-2 bg-brand-brown text-white px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-brown/20"
                    >
                        <ChefHat className="w-4 h-4" /> New Chef
                    </button>
                </div>
            </div>

            {/* Create Chef Modal Overlay */}
            <AnimatePresence>
                {isCreatingChef && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-serif text-2xl font-bold">Enlist Culinary Master</h3>
                                <button onClick={() => setIsCreatingChef(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors font-sans">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateChef} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Full Name</label>
                                    <input
                                        type="text" required
                                        value={newChef.name} onChange={e => setNewChef({ ...newChef, name: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                                        placeholder="Chef d'Excellence"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Identity Email</label>
                                    <input
                                        type="email" required
                                        value={newChef.email} onChange={e => setNewChef({ ...newChef, email: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                                        placeholder="chef@culixur.luxury"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Secure Passphrase</label>
                                    <input
                                        type="password" required
                                        value={newChef.password} onChange={e => setNewChef({ ...newChef, password: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all">
                                    Induct Master
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCreatingMember && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-serif text-2xl font-bold">Induct Member</h3>
                                <button onClick={() => setIsCreatingMember(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors font-sans">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateMember} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Assigned Member ID</label>
                                    <input type="text" required value={newMember.memberId} onChange={e => setNewMember({ ...newMember, memberId: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" placeholder="CX-XXXX" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Full Name</label>
                                    <input type="text" required value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Email</label>
                                    <input type="email" required value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Initial Passphrase</label>
                                    <input type="password" required value={newMember.passphrase} onChange={e => setNewMember({ ...newMember, passphrase: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                                </div>
                                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all">Induct Member</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isEditingUser && selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-serif text-2xl font-bold">Edit User</h3>
                                <button onClick={() => setIsEditingUser(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors font-sans">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateUser} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Member ID / System ID</label>
                                    <input type="text" disabled value={selectedUser.memberId || selectedUser.member_id || selectedUser.id} className="w-full px-5 py-4 bg-slate-100 text-slate-500 border border-slate-100 rounded-xl text-xs focus:outline-none transition-all cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Name</label>
                                    <input type="text" value={selectedUser.name} onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Email</label>
                                    <input type="email" value={selectedUser.email} onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Set New Passphrase (Reset)</label>
                                    <input type="password" placeholder="Leave blank to keep current" value={selectedUser.passphrase || ''} onChange={e => setSelectedUser({ ...selectedUser, passphrase: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Membership Tier</label>
                                    <select
                                        value={selectedUser.membershipTier}
                                        onChange={e => setSelectedUser({ ...selectedUser, membershipTier: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all font-bold"
                                    >
                                        <option value="CULIXUR">Culixur Member</option>
                                        <option value="ELITE">Elite Member</option>
                                    </select>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                                    <p><strong>Created:</strong> {new Date(selectedUser.created_at || selectedUser.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Role:</strong> {selectedUser.role}</p>
                                </div>
                                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all">Update</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-400 italic text-sm">Synchronizing Registry...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[9px] font-black tracking-widest text-slate-400">
                            <tr>
                                <th className="p-6">Identity</th>
                                <th className="p-6">Role</th>
                                <th className="p-6">Tier</th>
                                <th className="p-6">Assigned ID</th>
                                <th className="p-6">Registry Date</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic font-medium text-slate-600">
                            {users.filter((user: any) => {
                                const matchesSearch =
                                    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (user.member_id || '').toLowerCase().includes(searchTerm.toLowerCase());

                                const matchesCategory = filterCategory === 'ALL' || user.role === filterCategory;

                                return matchesSearch && matchesCategory;
                            }).map((user: any) => (
                                <AuthRow
                                    key={user.id}
                                    name={user.name}
                                    role={user.role}
                                    tier={user.membershipTier}
                                    id={user.member_id || user.chef_id || 'ADMIN'}
                                    date={new Date(user.created_at).toLocaleDateString()}
                                    onEdit={() => handleEditUser(user)}
                                    onDelete={() => handleDeleteUser(user)}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </motion.div>
    );
}

function BookingsTab({ searchTerm }: { searchTerm: string }) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await adminApi.getBookings();
                setBookings(data);
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (isLoading) return <div className="p-12 text-center text-slate-400 italic text-sm">Synchronizing Logistics...</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid gap-6">
                {bookings.filter((booking: any) =>
                    booking.member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.menu?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((booking: any) => (
                    <BookingLogCard
                        key={booking.id}
                        id={booking.order_id}
                        member={booking.member?.name}
                        phone={booking.member?.phone || 'N/A'}
                        address={booking.address}
                        menu={booking.menu?.name || 'Custom Menu'}
                        chef={booking.chef?.name || 'UNASSIGNED'}
                        chefStatus={booking.chef ? 'AVAILABLE' : 'PENDING'}
                        status={booking.status}
                    />
                ))}
                {bookings.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">No culinary logistics recorded</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function MenusTab({ searchTerm }: { searchTerm: string }) {
    const [menus, setMenus] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingMenu, setIsCreatingMenu] = useState(false);
    const [editingMenu, setEditingMenu] = useState<any>(null);
    const [newMenu, setNewMenu] = useState({ name: '', description: '', price: '', img: null as File | null });
    const [editForm, setEditForm] = useState({ name: '', description: '', price: '', img: null as File | null });

    const fetchMenus = async () => {
        setIsLoading(true);
        try {
            const data = await adminApi.getMenus();
            setMenus(data);
        } catch (err) {
            console.error("Failed to fetch menus:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditMenu = (menu: any) => {
        setEditingMenu(menu);
        setEditForm({
            name: menu.name,
            description: menu.description,
            price: (menu.fixed_price || menu.fixedPrice || '').toString(),
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

            await adminApi.updateMenu(editingMenu.id, formData);
            alert(`Menu updated successfully.`);
            setEditingMenu(null);
            fetchMenus();
        } catch (err: any) {
            console.error("Menu update failed:", err);
            alert(`Failed to update menu: ${err.message}`);
        }
    };

    const handleDeleteMenu = async (id: number) => {
        if (!confirm("Are you sure you want to delete this menu? This action cannot be undone.")) return;
        try {
            await adminApi.deleteMenu(id);
            alert("Menu deleted successfully.");
            fetchMenus();
        } catch (err: any) {
            console.error("Menu deletion failed:", err);
            alert(`Failed to delete menu: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const handleCreateMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newMenu.name);
            formData.append('description', newMenu.description);
            formData.append('price', newMenu.price);
            formData.append('serviceType', 'ATELIER');
            if (newMenu.img) {
                formData.append('image', newMenu.img);
            }

            console.log('Creating menu:', {
                name: newMenu.name,
                description: newMenu.description,
                price: newMenu.price,
                hasImage: !!newMenu.img
            });

            const response = await adminApi.createMenu(formData);

            if (!response || !response.id) {
                throw new Error('Menu creation returned no data');
            }

            console.log('Menu created successfully:', response);
            alert(`Menu "${response.name}" created successfully with ID: ${response.id}`);
            setIsCreatingMenu(false);
            setNewMenu({ name: '', description: '', price: '', img: null });
            fetchMenus();
        } catch (err: any) {
            console.error("Menu creation failed:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
            alert(`Failed to create menu: ${errorMessage}`);
        }
    };

    if (isLoading) return <div className="p-12 text-center text-slate-400 italic text-sm">Synchronizing Offerings...</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="font-serif text-2xl font-bold">Curated Offerings</h3>
                <button
                    onClick={() => setIsCreatingMenu(true)}
                    className="flex items-center gap-2 bg-brand-gold text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-gold/20 hover:scale-[1.02] transition-transform"
                >
                    <Plus className="w-5 h-5" /> Orchestrate New Menu
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 italic">
                {menus.filter((menu: any) =>
                    menu.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    menu.description?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((menu: any) => (
                    <MenuEditCard
                        key={menu.id}
                        name={menu.name}
                        price={Number(menu.fixedPrice || menu.fixed_price).toLocaleString()}
                        ingredients={menu.description}
                        media={`ID: ${menu.id}`}
                        image={menu.image}
                        onEdit={() => handleEditMenu(menu)}
                        onDelete={() => handleDeleteMenu(menu.id)}
                    />
                ))}
                {menus.length === 0 && (
                    <div className="md:col-span-2 py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">No curated offerings found</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {editingMenu && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative">
                            <button onClick={() => setEditingMenu(null)} className="absolute top-8 right-8 p-3 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="p-10">
                                <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6">
                                    <Edit className="w-8 h-8 text-brand-gold" />
                                </div>
                                <h3 className="font-serif text-3xl font-bold mb-2">Refine Offering</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">Updating: {editingMenu.name}</p>

                                <form onSubmit={handleUpdateMenu} className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Menu Identifier</label>
                                        <input type="text" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Heritage Narrative</label>
                                        <textarea required value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all h-32" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Settlement Value (₦)</label>
                                        <input type="number" required value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Update Visual Asset</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setEditForm({ ...editForm, img: e.target.files ? e.target.files[0] : null })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:scale-[1.02] transition-transform">
                                        Synchronize Changes
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {isCreatingMenu && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-serif text-2xl font-bold">Orchestrate Menu</h3>
                                <button onClick={() => setIsCreatingMenu(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors font-sans">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateMenu} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Menu Name</label>
                                    <input type="text" required value={newMenu.name} onChange={e => setNewMenu({ ...newMenu, name: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Description</label>
                                    <textarea required value={newMenu.description} onChange={e => setNewMenu({ ...newMenu, description: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all h-24" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Fixed Price (₦)</label>
                                    <input type="number" required value={newMenu.price} onChange={e => setNewMenu({ ...newMenu, price: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Menu Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setNewMenu({ ...newMenu, img: e.target.files ? e.target.files[0] : null })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-2 italic">Upload a high-quality image (JPG, PNG)</p>
                                </div>
                                <button type="submit" className="w-full bg-brand-gold text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand-gold/20 hover:scale-[1.02] transition-transform">
                                    Launch Offering
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* UI COMPONENTS */

function AdminSidebarLink({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 py-4 px-5 rounded-2xl transition-all group ${active ? 'bg-brand-gold text-slate-900 shadow-xl shadow-brand-gold/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <div className={`${active ? 'text-slate-900' : 'group-hover:text-brand-gold transition-colors'}`}>{icon}</div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
        </button>
    );
}

function StatCard({ label, value, trend, trendType, onClick, className }: { label: string, value: string | number, trend: string, trendType: 'up' | 'down' | 'neutral', onClick?: () => void, className?: string }) {
    return (
        <div onClick={onClick} className={`bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-gold/50 transition-all font-sans ${className || ''}`}>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">{label}</p>
            <div className="flex items-end justify-between">
                <h4 className="text-4xl font-serif font-bold text-slate-900">{value}</h4>
                <div className={`flex items-center gap-1 text-[10px] font-black italic rounded-full px-2 py-1 ${trendType === 'up' ? 'bg-green-50 text-green-600' : trendType === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                    {trendType === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : trendType === 'down' ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
                    {trend}
                </div>
            </div>
        </div>
    );
}

function AuthRow({ name, role, tier, id, date, onEdit, onDelete }: { name: string, role: string, tier?: string, id: string, date: string, onEdit: () => void, onDelete: () => void }) {
    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-400">
                        {name?.[0] || '?'}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{name}</span>
                </div>
            </td>
            <td className="p-6">
                <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${role === 'CHEF' ? 'bg-brand-brown/5 text-brand-brown border-brand-brown/20' : 'bg-brand-gold/5 text-brand-gold border-brand-gold/20'
                    }`}>
                    {role}
                </span>
            </td>
            <td className="p-6">
                {tier && (
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-md border ${tier === 'ELITE' ? 'bg-slate-900 text-brand-gold border-brand-gold/20' : 'bg-brand-ivory text-brand-brown border-brand-brown/10'
                        }`}>
                        {tier}
                    </span>
                )}
            </td>
            <td className="p-6 text-sm font-mono tracking-tighter text-slate-900">{id}</td>
            <td className="p-6 text-xs text-slate-400">{date}</td>
            <td className="p-6 text-right flex items-center justify-end gap-2">
                <button onClick={onEdit} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove Member"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
}

function BookingLogCard({ id, member, phone, address, menu, chef, chefStatus, status }: any) {
    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm hover:border-brand-gold/30 transition-all font-sans">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest">#{id}</span>
                        <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">{status}</span>
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-slate-900 mb-6">{member}</h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</p>
                            <p className="text-sm font-bold text-slate-700">{address}</p>
                            <p className="text-xs text-slate-400 mt-1">{phone}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Culinary Orbit</p>
                            <p className="text-sm font-bold text-slate-700">{menu}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Master</p>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-900">{chef}</p>
                                <span className={`w-2 h-2 rounded-full ${chefStatus === 'AVAILABLE' ? 'bg-green-500' : 'bg-red-500'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full lg:w-64 pt-4">
                    <button className="bg-slate-900 text-white w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:scale-[1.02] transition-transform">
                        Reassign Master
                    </button>
                    <button className="border border-slate-200 text-slate-900 w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
                        Detailed Logistics
                    </button>
                </div>
            </div>
        </div>
    );
}

function MenuEditCard({ name, price, ingredients, media, image, onEdit, onDelete }: { name: string, price: string, ingredients: string, media: string, image?: string, onEdit?: () => void, onDelete?: () => void }) {
    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm group hover:border-brand-gold/30 transition-all font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 flex gap-2">
                <button onClick={onEdit} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all" title="Edit Menu">
                    <Edit className="w-4 h-4" />
                </button>
                <button onClick={onDelete} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-brand-burgundy hover:text-white transition-all" title="Delete Menu">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-ivory rounded-2xl flex items-center justify-center text-brand-gold overflow-hidden">
                    {image ? (
                        <img src={image.startsWith('http') ? image : `http://localhost:3001${image}`} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-6 h-6" />
                    )}
                </div>
                <div>
                    <h4 className="font-serif text-2xl font-bold text-slate-900">{name}</h4>
                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">{media}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Heritage Components</p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{ingredients}</p>
                </div>
                <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settlement Value</p>
                        <p className="text-xl font-bold text-slate-900">₦{price}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                        Locked until checkout
                    </div>
                </div>
            </div>
        </div>
    );
}

function OverviewOrder({ id, member, status, price }: { id: string | number, member: string, status: string, price: string }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    LOG-X
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900">{member}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">{id}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold text-slate-900 mb-1">{price}</p>
                <span className={`text-[8px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full border shadow-sm ${status === 'EN_ROUTE' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                    {status}
                </span>
            </div>
        </div>
    );
}

function OverviewApp({ app, onApprove, onReject }: { app: any, onApprove: (id: string | number) => void, onReject: (id: string | number) => void }) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const name = `${app.firstName} ${app.lastName}`;
    const category = app.membershipTier;
    const date = new Date(app.createdAt || app.created_at).toLocaleDateString();

    return (
        <>
            <div className="flex items-center justify-between p-6 rounded-[1.5rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 group cursor-pointer" onClick={() => setIsDetailOpen(true)}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-gold/5 border border-brand-gold/10 flex items-center justify-center text-brand-gold font-bold text-lg">
                        {name?.[0] || '?'}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{name}</p>
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mt-0.5">{category}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onApprove(app.id); }}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onReject(app.id); }}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="text-right ml-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{date}</p>
                        <MoreHorizontal className="w-5 h-5 text-slate-300 group-hover:text-slate-900 ml-auto mt-2 transition-colors" />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isDetailOpen && (
                    <MembershipDetailModal
                        app={app}
                        onClose={() => setIsDetailOpen(false)}
                        onApprove={onApprove}
                        onReject={onReject}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

function MembershipDetailModal({ app, onClose, onApprove, onReject }: { app: any, onClose: () => void, onApprove: (id: string | number) => void, onReject: (id: string | number) => void }) {
    const qualifiers = app.eliteQualifiers ? JSON.parse(app.eliteQualifiers) : null;

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
                className="bg-white rounded-[3rem] p-12 w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
                <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                </button>

                <div className="mb-12">
                    <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] mb-3 block">Membership Portfolio Review</span>
                    <h2 className="font-serif text-4xl font-bold text-slate-900">{app.firstName} {app.lastName}</h2>
                    <p className="text-slate-400 text-sm mt-2">{app.email} • {app.phone}</p>
                </div>

                <div className="grid grid-cols-2 gap-10 mb-12">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Selected Tier</p>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${app.membershipTier === 'ELITE' ? 'bg-slate-900 text-brand-gold border-brand-gold/20 shadow-xl shadow-brand-gold/10' : 'bg-brand-ivory text-brand-brown border-brand-brown/10'}`}>
                            {app.membershipTier}
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location Context</p>
                        <p className="text-sm font-bold text-slate-700">{app.location || 'N/A'}</p>
                    </div>
                </div>

                {qualifiers && (
                    <div className="bg-slate-50 rounded-[2rem] p-8 mb-12 space-y-8 border border-slate-100">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-4">Professional & Financial Insight</p>
                        <div className="grid grid-cols-2 gap-8">
                            <DetailItem label="Entity / Company" value={qualifiers.company} />
                            <DetailItem label="Official Capacity" value={qualifiers.position} />
                            <DetailItem label="Economic Sector" value={qualifiers.industry} />
                            <DetailItem label="Asset Bracket" value={qualifiers.netWorth} />
                        </div>
                    </div>
                )}

                <div className="mb-12">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Aspiration Message</p>
                    <div className="bg-brand-ivory/30 p-8 rounded-3xl border border-brand-brown/5">
                        <p className="text-sm text-slate-700 leading-relaxed italic">"{app.message || 'No personal statement provided.'}"</p>
                    </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button
                        onClick={() => { onApprove(app.id); onClose(); }}
                        className="flex-grow bg-slate-900 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Grant Access
                    </button>
                    <button
                        onClick={() => { onReject(app.id); onClose(); }}
                        className="flex-grow border border-slate-200 text-red-500 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-colors"
                    >
                        Decline Dossier
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xs font-bold text-slate-900">{value || 'UNSPECIFIED'}</p>
        </div>
    );
}

function ChefsTab() {
    const [chefs, setChefs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingChef, setEditingChef] = useState<any>(null);

    useEffect(() => {
        const fetchChefs = async () => {
            try {
                const users = await adminApi.getUsers();
                setChefs(users.filter((u: any) => u.role === 'CHEF'));
            } catch (error) {
                console.error("Failed to fetch chefs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChefs();
    }, []);

    const filteredChefs = chefs.filter(chef =>
        chef.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chef.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdateChef = async (id: number, data: FormData) => {
        try {
            await adminApi.updateChef(id, data);
            // Refresh list
            const users = await adminApi.getUsers();
            setChefs(users.filter((u: any) => u.role === 'CHEF'));
            setEditingChef(null);
            alert('Chef profile updated successfully');
        } catch (error) {
            console.error("Update failed:", error);
            alert('Failed to update chef profile');
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-400 font-serif italic">Loading Culinary Talent...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-brand-ivory/50 p-6 rounded-[2rem] border border-brand-brown/5">
                <div>
                    <h2 className="font-serif text-3xl font-bold text-slate-900">Culinary Talent</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage Squad & Profiles</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search chefs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChefs.map(chef => (
                    <div key={chef.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-brand-brown/5 relative group hover:border-brand-gold/30 transition-all overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setEditingChef(chef)}
                                className="p-2 bg-slate-50 rounded-full hover:bg-slate-900 hover:text-white transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-5 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-brand-brown/5 flex items-center justify-center overflow-hidden">
                                {chef.image || chef.chefProfile?.image ? (
                                    <img
                                        src={chef.chefProfile?.image?.startsWith('http') ? chef.chefProfile.image : `http://localhost:3001${chef.chefProfile?.image || chef.image}`}
                                        alt={chef.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-6 h-6 text-brand-brown/40" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-serif text-lg font-bold text-slate-900">{chef.name}</h3>
                                <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">{chef.chefProfile?.specialty || 'General Chef'}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Bio Excerpt</p>
                                <p className="text-xs text-slate-600 line-clamp-2">{chef.chefProfile?.bio || 'No biography set.'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${chef.chefProfile?.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {chef.chefProfile?.isAvailable ? 'Active' : 'Busy'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                                    <p className="text-xs font-bold text-slate-900">{chef.chefProfile?.experienceYears || 0} Years</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {editingChef && (
                    <ChefEditModal
                        chef={editingChef}
                        onClose={() => setEditingChef(null)}
                        onSave={handleUpdateChef}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ChefEditModal({ chef, onClose, onSave }: { chef: any, onClose: () => void, onSave: (id: number, data: FormData) => void }) {
    const [form, setForm] = useState({
        name: chef.name,
        email: chef.email,
        bio: chef.chefProfile?.bio || '',
        specialty: chef.chefProfile?.specialty || '',
        image: null as File | null,
        categories: chef.chefProfile?.categories || []
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('email', form.email);
        formData.append('bio', form.bio);
        formData.append('specialty', form.specialty);
        formData.append('categories', JSON.stringify(form.categories));
        if (form.image) {
            formData.append('image', form.image);
        }
        onSave(chef.id, formData);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
                className="bg-white rounded-[3rem] p-12 w-full max-w-lg shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                </button>

                <h2 className="font-serif text-3xl font-bold text-slate-900 mb-8">Edit Chef Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest block">Full Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest block">Main Specialty</label>
                            <input type="text" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest block">Email Access</label>
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest block">Professional Bio</label>
                        <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 h-24 resize-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest block">Profile Portrait</label>
                        <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files ? e.target.files[0] : null })} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-slate-900 file:text-white" />
                    </div>

                    <button type="submit" className="w-full bg-brand-gold text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all mt-4">
                        Save Changes
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}
