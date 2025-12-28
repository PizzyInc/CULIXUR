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
    Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { adminApi, authApi } from '@/lib/api';

type AdminTab = 'overview' | 'authorization' | 'bookings' | 'menus';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await adminApi.getDashboard();
                setDashboardData(data);
            } catch (err) {
                console.error("Admin dashboard fetch failed:", err);
                setError('Failed to load operations data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

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
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden ring-2 ring-brand-gold/20">
                            <img src="https://ui-avatars.com/api/?name=Admin+Hub&background=020617&color=fff" alt="Admin" />
                        </div>
                        <div>
                            <p className="text-xs font-bold">Systems Admin</p>
                            <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest mt-0.5">Global Controller</p>
                        </div>
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
                            <input type="text" placeholder="Global search..." className="pl-11 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs w-72 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all shadow-sm" />
                        </div>
                        <button className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && <OverviewTab key="overview" data={dashboardData} />}
                    {activeTab === 'authorization' && <AuthorizationTab key="auth" />}
                    {activeTab === 'bookings' && <BookingsTab key="bookings" />}
                    {activeTab === 'menus' && <MenusTab key="menus" />}
                </AnimatePresence>
            </main>
        </div>
    );
}

function OverviewTab({ data }: { data: any }) {
    if (!data) return null;

    const stats = data.stats;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Live Orders" value={stats.live_orders} trend="+2" trendType="up" />
                <StatCard label="Active Chefs" value={stats.active_chefs} trend="0" trendType="neutral" />
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
                        {data.recent_logistics?.map((order: any) => (
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
                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Queue</button>
                    </div>
                    <div className="space-y-8">
                        {data.pending_applications?.map((app: any) => (
                            <OverviewApp
                                key={app.id}
                                name={app.name}
                                category={app.membership_tier}
                                date={new Date(app.created_at).toLocaleDateString()}
                            />
                        ))}
                        {(!data.pending_applications || data.pending_applications.length === 0) && (
                            <p className="text-xs text-slate-400 italic">No pending applications</p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function AuthorizationTab() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminApi.getUsers();
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-200">
                <div>
                    <h3 className="font-serif text-xl font-bold mb-1">Credential Master</h3>
                    <p className="text-xs text-slate-400">Mint new member IDs and chef passphrases.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-slate-900/20">
                        <UserPlus className="w-4 h-4" /> New Member
                    </button>
                    <button className="flex items-center gap-2 bg-brand-brown text-white px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-brown/20">
                        <ChefHat className="w-4 h-4" /> New Chef
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-400 italic text-sm">Synchronizing Registry...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[9px] font-black tracking-widest text-slate-400">
                            <tr>
                                <th className="p-6">Identity</th>
                                <th className="p-6">Role</th>
                                <th className="p-6">Assigned ID</th>
                                <th className="p-6">Registry Date</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic font-medium text-slate-600">
                            {users.map((user: any) => (
                                <AuthRow
                                    key={user.id}
                                    name={user.name}
                                    role={user.role}
                                    id={user.member_id || user.chef_id || 'ADMIN'}
                                    date={new Date(user.created_at).toLocaleDateString()}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </motion.div>
    );
}

function BookingsTab() {
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
                {bookings.map((booking: any) => (
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

function MenusTab() {
    const [menus, setMenus] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const data = await adminApi.getMenus();
                setMenus(data);
            } catch (err) {
                console.error("Failed to fetch menus:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenus();
    }, []);

    if (isLoading) return <div className="p-12 text-center text-slate-400 italic text-sm">Synchronizing Offerings...</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="font-serif text-2xl font-bold">Curated Offerings</h3>
                <button className="flex items-center gap-2 bg-brand-gold text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-gold/20 hover:scale-[1.02] transition-transform">
                    <Plus className="w-5 h-5" /> Orchestrate New Menu
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 italic">
                {menus.map((menu: any) => (
                    <MenuEditCard
                        key={menu.id}
                        name={menu.name}
                        price={Number(menu.fixed_price).toLocaleString()}
                        ingredients={menu.description}
                        media={`ID: ${menu.id}`}
                    />
                ))}
                {menus.length === 0 && (
                    <div className="md:col-span-2 py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">No curated offerings found</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/* UI COMPONENTS */

function AdminSidebarLink({ icon, label, active = false, onClick }: any) {
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

function StatCard({ label, value, trend, trendType }: any) {
    return (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-gold/50 transition-all font-sans">
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

function AuthRow({ name, role, id, date }: any) {
    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-400">
                        {name[0]}
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
            <td className="p-6 text-sm font-mono tracking-tighter text-slate-900">{id}</td>
            <td className="p-6 text-xs text-slate-400">{date}</td>
            <td className="p-6 text-right">
                <button className="text-slate-400 hover:text-slate-900 transition-colors">
                    <MoreHorizontal className="w-5 h-5 ml-auto" />
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

function MenuEditCard({ name, price, ingredients, media }: any) {
    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm group hover:border-brand-gold/30 transition-all font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
                <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                    <Edit className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-ivory rounded-2xl flex items-center justify-center text-brand-gold">
                    <ImageIcon className="w-6 h-6" />
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

function OverviewOrder({ id, member, status, price }: any) {
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

function OverviewApp({ name, category, date }: any) {
    return (
        <div className="flex items-center justify-between p-6 rounded-[1.5rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-gold/5 border border-brand-gold/10 flex items-center justify-center text-brand-gold font-bold text-lg">
                    {name[0]}
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900">{name}</p>
                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mt-0.5">{category}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{date}</p>
                <MoreHorizontal className="w-5 h-5 text-slate-300 group-hover:text-slate-900 ml-auto mt-2 transition-colors" />
            </div>
        </div>
    );
}
