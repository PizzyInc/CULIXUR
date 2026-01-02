import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChefHat,
    UtensilsCrossed,
    Users,
    Calendar as CalendarIcon,
    MapPin,
    ChevronRight,
    ChevronLeft,
    Check,
    Search,
    Info
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memberApi, authApi } from '@/lib/api';

const serviceTypes = [
    { id: 'ATELIER', title: 'The Atelier', description: 'Bespoke private dining at your residence.', price: '₦1,500,000+' },
    { id: 'BOARDROOM', title: 'The Boardroom', description: 'Corporate culinary logistics for elite executives.', price: '₦1,250,000+' },
    { id: 'GATHERING', title: 'The Gathering', description: 'Curated experiences for intimate celebrations.', price: '₦575,000+' },
    { id: 'RENDEZVOUS', title: 'Rendez-Vous', description: 'Exclusive date night with master chef service.', price: '₦575,000+' },
];

export default function BookPage() {
    const [isElite, setIsElite] = useState(false);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [menus, setMenus] = useState<any[]>([]);
    const [chefs, setChefs] = useState<any[]>([]);
    const [error, setError] = useState('');

    const [booking, setBooking] = useState({
        service_type: '',
        menu_id: null,
        selected_chefs: [] as number[],
        datetime: '',
        address: '',
        guest_count: 2,
        allergies: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await authApi.getUser();
                setIsElite(user.is_elite);

                const data = await memberApi.getBookingDetails();
                setMenus(data.menus);
                setChefs(data.chefs);
            } catch (err) {
                console.error("Failed to fetch booking data:", err);
                setError('Failed to load experience details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const toggleChef = (id: number) => {
        setBooking(prev => {
            if (prev.selected_chefs.includes(id)) {
                return { ...prev, selected_chefs: prev.selected_chefs.filter(c => c !== id) };
            }
            if (prev.selected_chefs.length >= 3) return prev;
            return { ...prev, selected_chefs: [...prev.selected_chefs, id] };
        });
    };

    const handleFinalize = async () => {
        setError('');
        setIsSubmitting(true);
        try {
            await memberApi.book(booking);
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.message || 'Submission failed');
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
                <div className="text-brand-brown font-serif italic text-xl animate-pulse">Curating Selection...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-ivory flex flex-col">
            <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-brown/5 px-8 flex items-center justify-between sticky top-0 z-50">
                <Link href="/dashboard" className="flex items-center gap-2 text-brand-brown/60 hover:text-brand-brown transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
                </Link>
                <span className="font-serif text-xl font-bold text-brand-brown">Secure Booking</span>
                <div className="w-20" /> {/* Spacer */}
            </nav>

            <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
                {/* Progress Indicator */}
                <div className="flex justify-center mb-16">
                    <div className="flex items-center gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= i ? 'bg-brand-brown text-white' : 'bg-brand-brown/10 text-brand-brown/40'
                                    }`}>
                                    {step > i ? <Check className="w-5 h-5" /> : i}
                                </div>
                                {i < 4 && <div className={`w-12 h-[2px] mx-2 ${step > i ? 'bg-brand-brown' : 'bg-brand-brown/10'}`} />}
                            </div>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-widest text-center mb-8"
                        >
                            {error}
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <div className="md:col-span-2 text-center mb-8">
                                <h2 className="font-serif text-3xl font-bold text-brand-brown mb-2">Select Your Experience</h2>
                                <p className="text-brand-muted text-sm font-medium">Choose the caliber of logistics for your culinary affair.</p>
                            </div>
                            {serviceTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => { setBooking({ ...booking, service_type: type.id }); nextStep(); }}
                                    className={`p-8 bg-white rounded-3xl text-left border-2 transition-all hover:shadow-2xl hover:shadow-brand-brown/10 group ${booking.service_type === type.id ? 'border-brand-gold ring-1 ring-brand-gold' : 'border-transparent'
                                        }`}
                                >
                                    <div className="w-12 h-12 bg-brand-ivory rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-gold/10 transition-colors">
                                        <Check className={`w-6 h-6 transition-colors ${booking.service_type === type.id ? 'text-brand-gold' : 'text-brand-brown/20'}`} />
                                    </div>
                                    <h3 className="font-serif text-2xl font-bold text-brand-brown mb-2">{type.title}</h3>
                                    <p className="text-xs text-brand-muted leading-relaxed mb-6">{type.description}</p>
                                    <div className="flex justify-between items-center pt-6 border-t border-brand-brown/5">
                                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em]">{type.price}</span>
                                        <ChevronRight className="w-4 h-4 text-brand-gold" />
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className="text-center">
                                <h2 className="font-serif text-3xl font-bold text-brand-brown mb-2">Curate the Menu</h2>
                                <p className="text-brand-muted text-sm font-medium">Global flavors meticulously researched and refined.</p>
                            </div>
                            <div className="grid gap-6">
                                {menus.map((menu) => (
                                    <button
                                        key={menu.id}
                                        onClick={() => { setBooking({ ...booking, menu_id: menu.id as any }); nextStep(); }}
                                        className={`p-8 bg-white rounded-3xl flex flex-col md:flex-row items-center gap-8 text-left border-2 transition-all hover:border-brand-gold ${booking.menu_id === menu.id ? 'border-brand-gold' : 'border-transparent'
                                            }`}
                                    >
                                        <div className="flex-grow">
                                            <h4 className="font-serif text-xl font-bold text-brand-brown mb-1">{menu.name}</h4>
                                            <p className="text-xs text-brand-muted mb-4">{menu.description}</p>
                                            <div className="flex gap-4">
                                                <span className="flex items-center gap-1.5 text-[9px] font-bold text-brand-brown/60 uppercase tracking-widest"><Info className="w-3 h-3" /> Tasting Menu</span>
                                                <span className="flex items-center gap-1.5 text-[9px] font-bold text-brand-brown/60 uppercase tracking-widest"><Users className="w-3 h-3" /> Min 2 Guests</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-brand-brown">₦{Number(menu.fixed_price).toLocaleString()}</p>
                                            <p className="text-[9px] text-brand-muted font-bold uppercase tracking-widest">Base Price / Guest</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="text-center mb-12">
                                <h2 className="font-serif text-3xl font-bold text-brand-brown mb-2">Select Your Masters</h2>
                                <p className="text-brand-muted text-sm font-medium">Select up to 3 chefs for this bespoke orchestration.</p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                {chefs.map((chef) => (
                                    <button
                                        key={chef.id}
                                        onClick={() => toggleChef(chef.id)}
                                        className={`p-6 bg-white rounded-3xl border-2 transition-all text-center relative overflow-hidden ${booking.selected_chefs.includes(chef.id) ? 'border-brand-gold bg-brand-gold/5' : 'border-transparent'
                                            }`}
                                    >
                                        {booking.selected_chefs.includes(chef.id) && (
                                            <div className="absolute top-4 right-4 bg-brand-gold text-white p-1 rounded-full">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                        <div className="w-24 h-24 mx-auto mb-6 relative">
                                            <div className="absolute inset-0 border-2 border-brand-gold/20 rounded-full scale-110" />
                                            <img src={chef.avatar} alt={chef.name} className="w-full h-full rounded-full object-cover" />
                                        </div>
                                        <h4 className="font-serif text-lg font-bold text-brand-brown mb-1">{chef.name}</h4>
                                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-4">{chef.specialty}</p>
                                        <button className={`text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${booking.selected_chefs.includes(chef.id) ? 'bg-brand-brown text-white' : 'bg-brand-ivory text-brand-brown'
                                            }`}>
                                            {booking.selected_chefs.includes(chef.id) ? 'Selected' : 'Select Chef'}
                                        </button>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={nextStep}
                                    disabled={booking.selected_chefs.length === 0}
                                    className="bg-brand-brown text-white text-[10px] font-bold uppercase tracking-widest px-12 py-5 rounded-full hover:bg-black transition-all disabled:opacity-50"
                                >
                                    Confirm Logistics
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-brand-brown/10 border border-brand-brown/5"
                        >
                            <div className="text-center mb-12">
                                <h2 className="font-serif text-3xl font-bold text-brand-brown mb-2">Refining the Details</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <FormGroup label="Event Date & Time">
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-brand-ivory/30 border border-brand-brown/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                                        value={booking.datetime}
                                        onChange={e => setBooking({ ...booking, datetime: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup label="Number of Distinguished Guests">
                                    <select
                                        className="w-full bg-brand-ivory/30 border border-brand-brown/5 rounded-2xl px-6 py-4 text-sm focus:outline-none appearance-none"
                                        value={booking.guest_count}
                                        onChange={e => setBooking({ ...booking, guest_count: parseInt(e.target.value) })}
                                    >
                                        {[2, 4, 6, 8, 10, 12, 20].map(n => <option key={n} value={n}>{n} Guests</option>)}
                                    </select>
                                </FormGroup>
                                <div className="md:col-span-2">
                                    <FormGroup label="Exquisite Location (Address)">
                                        <input
                                            type="text"
                                            placeholder="Ikoyi, Victoria Island..."
                                            className="w-full bg-brand-ivory/30 border border-brand-brown/5 rounded-2xl px-6 py-4 text-sm focus:outline-none"
                                            value={booking.address}
                                            onChange={e => setBooking({ ...booking, address: e.target.value })}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="md:col-span-2">
                                    <FormGroup label="Allergies or Special Considerations">
                                        <textarea
                                            placeholder="Any specific preferences our culinary team should be aware of..."
                                            className="w-full bg-brand-ivory/30 border border-brand-brown/5 rounded-2xl px-6 py-4 text-sm h-32 resize-none focus:outline-none"
                                            value={booking.allergies}
                                            onChange={e => setBooking({ ...booking, allergies: e.target.value })}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={handleFinalize}
                                    disabled={isSubmitting || !booking.datetime || !booking.address}
                                    className="bg-brand-gold text-white text-[10px] font-bold uppercase tracking-widest px-16 py-6 rounded-full hover:bg-brand-brown transition-all shadow-xl shadow-brand-gold/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Orchestrating...' : (isElite ? 'Finalize Orchestration (Elite Access)' : 'Proceed to Settlement')}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {step > 1 && step < 4 && (
                    <div className="mt-8 flex justify-center">
                        <button onClick={prevStep} className="text-[10px] font-bold uppercase tracking-widest text-brand-muted hover:text-brand-brown transition-colors">
                            Go Back
                        </button>
                    </div>
                )}
            </main>
        </div >
    );
}

function FormGroup({ label, children }: { label: string, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest ml-1">{label}</label>
            {children}
        </div>
    );
}
