'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="font-sans antialiased bg-brand-ivory">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isMobileMenuOpen ? 'bg-brand-ivory' : 'bg-brand-ivory/85 backdrop-blur-md'} border-b border-brand-brown/5`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="Culixur Logo" width={120} height={40} className="h-8 w-auto brightness-0" />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-12">
              <Link href="#services" className="text-xs font-semibold uppercase tracking-widest text-brand-brown/70 hover:text-brand-gold transition-colors">Experiences</Link>
              <Link href="#about" className="text-xs font-semibold uppercase tracking-widest text-brand-brown/70 hover:text-brand-gold transition-colors">Our Ethos</Link>
              <Link href="/login" className="text-xs font-semibold uppercase tracking-widest text-brand-brown hover:text-brand-gold transition-colors">Login</Link>
              <Link href="/apply" className="bg-brand-burgundy text-white hover:bg-brand-brown px-8 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm transition-all duration-300 hover:brightness-110">
                Request Invite
              </Link>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-brand-brown p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-brand-ivory border-t border-brand-brown/5 overflow-hidden"
            >
              <div className="px-6 py-8 space-y-6">
                <Link
                  href="#services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-widest text-brand-brown/70 hover:text-brand-gold transition-colors"
                >
                  Experiences
                </Link>
                <Link
                  href="#about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-widest text-brand-brown/70 hover:text-brand-gold transition-colors"
                >
                  Our Ethos
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-widest text-brand-brown hover:text-brand-gold transition-colors"
                >
                  Member Login
                </Link>
                <Link
                  href="/apply"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block bg-brand-burgundy text-white text-center py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm"
                >
                  Request Invite
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center text-white relative overflow-hidden bg-gradient-to-br from-[#2D1B08] via-[#3A090D] to-[#7A2F35]">
        {/* Grain overlay simulated with opacity pattern in CSS or simple overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>

        {/* Floating light effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32 relative z-10 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="inline-block mb-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <Image
                  src="/logo.png"
                  alt="Culixur Logo"
                  width={400}
                  height={150}
                  className="h-28 md:h-40 w-auto"
                />
              </motion.div>
            </div>

            <h1 className="font-serif text-5xl md:text-8xl font-bold mb-10 tracking-tight leading-[1.1]">
              The Taste of <span className="italic text-brand-gold">Prestige</span>
            </h1>

            <p className="text-lg md:text-xl mb-16 max-w-2xl mx-auto text-white/80 font-light leading-relaxed tracking-wide">
              Exclusive access to world-class private chefs.
              Tailored menus and culinary artistry in the comfort of your sanctuary.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="#services" className="bg-white text-brand-brown px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-ivory transition-all duration-500 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transform hover:-translate-y-1">
                Explore Collections
              </Link>
              <Link href="/apply" className="border border-brand-gold/30 text-white px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] backdrop-blur-sm hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-1">
                Apply for Membership
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="w-[1px] h-16 bg-white mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-gold"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-brand-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">Our Collections</span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-brand-brown mb-8">Culinary Experiences</h2>
            <div className="w-24 h-[1px] bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card
              title="The Atelier"
              description="Bespoke private dining curated by master chefs in your sanctuary."
              tag="Premium"
              image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800"
            />
            <Card
              title="The Boardroom"
              description="Executive dining designed for the sophisticated corporate palate."
              tag="Executive"
              image="https://images.unsplash.com/photo-1577979749830-f1d742b96791?auto=format&fit=crop&q=80&w=800"
            />
            <Card
              title="The Gathering"
              description="Interactive stations and family-style feasts fostering joy."
              tag="Social"
              image="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800"
            />
            <Card
              title="Rendez-Vous"
              description="Intimate, candlelit experiences curated for magical moments."
              tag="Romantic"
              image="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute -right-24 bottom-0 w-96 h-96 bg-brand-ivory rounded-full opacity-50 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-brown mb-10 leading-tight">
                Excellence is not a <span className="italic text-brand-gold">standard</span>, it is our legacy.
              </h2>
              <p className="text-brand-brown/70 text-lg mb-12 leading-relaxed">
                At Culixur, we curate more than just meals. We deliver storied experiences crafted by elite chefs from Michelin-starred backgrounds, brought directly to your home.
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <div className="w-10 h-[1px] bg-brand-gold mb-4"></div>
                  <h4 className="font-bold text-brand-brown text-sm uppercase tracking-widest mb-2">Elite Chefs</h4>
                  <p className="text-brand-brown/60 text-sm">Handpicked masters of culinary artistry with world-class backgrounds.</p>
                </div>
                <div>
                  <div className="w-10 h-[1px] bg-brand-gold mb-4"></div>
                  <h4 className="font-bold text-brand-brown text-sm uppercase tracking-widest mb-2">Exclusive Access</h4>
                  <p className="text-brand-brown/60 text-sm">A members-only sanctuary designed for the discerning few.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl relative">
                <Image
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800"
                  alt="Elite Plating"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-brand-burgundy text-white p-10 rounded-2xl shadow-2xl hidden md:block">
                <p className="font-serif text-5xl font-bold mb-1">500+</p>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-70">Curated Moments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-brand-burgundy relative overflow-hidden text-white">
        {/* Floating textures */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-gold/20 rounded-full blur-[80px]"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-10 leading-tight">
            Join the <span className="italic text-brand-gold">Inner Circle</span>
          </h2>
          <p className="text-xl mb-16 text-white/80 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            Experience the pinnacle of private culinary artistry. Exclusive events, priority booking, and sophisticated dining await.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link href="/apply" className="bg-brand-gold text-brand-brown px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-white transition-all duration-500 transform hover:-translate-y-1">
              Apply for Membership
            </Link>
            <Link href="/login" className="text-white border border-white/30 px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] backdrop-blur-sm hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-1">
              Member Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-brown text-white py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-16 items-center">
            <div className="col-span-2">
              <Image src="/logo.png" alt="Culixur Logo" width={150} height={50} className="h-10 w-auto mb-6" />
              <p className="text-white/50 text-sm max-w-sm leading-relaxed mb-8">
                Redefining private dining with elegance, expertise, and exclusivity. The pinnacle of culinary luxury for the modern epicurean.
              </p>
              <div className="flex gap-4 mb-8">
                <Link href="https://instagram.com/culixur" target="_blank" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <img src="https://www.google.com/s2/favicons?domain=instagram.com&sz=32" alt="Instagram" className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                </Link>
                <Link href="https://x.com/culixur" target="_blank" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <img src="https://www.google.com/s2/favicons?domain=x.com&sz=32" alt="Twitter/X" className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                </Link>
                <Link href="https://tiktok.com/@culixur" target="_blank" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <img src="https://www.google.com/s2/favicons?domain=tiktok.com&sz=32" alt="TikTok" className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                </Link>
              </div>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-4">Contact Concierge</p>
              <p className="text-xl font-serif text-brand-gold">concierge@culixur.com</p>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/20">
            <p>&copy; 2026 Culixur. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Powered by Pizzy Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Card({ title, description, tag, image }: { title: string; description: string; tag: string; image: string }) {
  return (
    <div className="bg-white border border-brand-brown/5 rounded-2xl overflow-hidden group transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(45,27,8,0.08)] hover:border-brand-gold/50">
      <div className="h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-brown/20 z-10 transition-opacity duration-500 group-hover:opacity-0"></div>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transform transition-transform duration-1000 group-hover:scale-110"
        />
      </div>
      <div className="p-10 text-center">
        <h3 className="font-serif text-2xl font-bold text-brand-brown mb-4">{title}</h3>
        <p className="text-brand-brown/60 text-sm leading-relaxed mb-6">
          {description}
        </p>
        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest border-b border-brand-gold/30 pb-1">{tag}</span>
      </div>
    </div>
  );
}
