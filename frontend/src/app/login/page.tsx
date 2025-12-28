'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function LoginPage() {
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [memberId, setMemberId] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let scanner: any = null;

        if (showQRScanner) {
            scanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            scanner.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scanner) {
                scanner.clear().catch((error: any) => console.error("Failed to clear html5-qrcode scanner. ", error));
            }
        };
    }, [showQRScanner]);

    function onScanSuccess(decodedText: string) {
        const parts = decodedText.split('_');
        const scannedId = parts.length > 1 ? parts[1] : decodedText;

        if (scannedId) {
            setMemberId('MEM' + scannedId);
            setShowQRScanner(false);
        }
    }

    function onScanFailure(error: any) {
        // Handle scan failure
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await authApi.login({
                identifier: memberId,
                password: passphrase,
            });

            localStorage.setItem('auth_token', data.access_token);

            // Redirect based on role
            switch (data.user.role) {
                case 'ADMIN':
                    window.location.href = '/admin';
                    break;
                case 'CHEF':
                    window.location.href = '/culinary';
                    break;
                case 'MEMBER':
                    window.location.href = '/dashboard';
                    break;
                default:
                    window.location.href = '/';
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-brand-ivory">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <div className="flex justify-center mb-8">
                        <Link href="/" className="flex flex-col items-center">
                            <div className="w-12 h-[1px] bg-brand-gold mb-3 opacity-50"></div>
                            <span className="font-serif text-2xl tracking-[0.4em] uppercase text-brand-brown font-light">
                                Culixur
                            </span>
                            <div className="w-12 h-[1px] bg-brand-gold mt-3 opacity-50"></div>
                        </Link>
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-brand-brown">Member Portal</h1>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.3em] font-bold text-brand-muted">Your Legacy, Forged at Table</p>
                </div>
                <h2 className="mt-8 text-center text-xl font-serif text-brand-brown/80 italic">
                    Membership Entrance
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-brand-brown/5 sm:rounded-2xl sm:px-10 border border-brand-brown/5">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="member_id" className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">
                                Member ID / Identifier
                            </label>
                            <div className="mt-1">
                                <input
                                    id="member_id"
                                    name="member_id"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={memberId}
                                    onChange={(e) => setMemberId(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-brand-brown/10 rounded-xl bg-brand-ivory/50 placeholder-brand-muted/40 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all sm:text-sm text-brand-brown"
                                    placeholder="MEM001 or Email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="passphrase" className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">
                                Passphrase / Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="passphrase"
                                    name="passphrase"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={passphrase}
                                    onChange={(e) => setPassphrase(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-brand-brown/10 rounded-xl bg-brand-ivory/50 placeholder-brand-muted/40 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all sm:text-sm text-brand-brown"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent text-xs font-bold uppercase tracking-[0.2em] rounded-full text-white bg-brand-burgundy hover:bg-brand-brown hover:-translate-y-px hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Access Portal'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-brand-brown/10" />
                            </div>
                        </div>

                        {/* QR Code Login Trigger */}
                        <div className="mt-6 bg-brand-ivory/50 p-4 rounded-xl border border-brand-brown/5">
                            <h3 className="text-sm font-medium text-brand-brown mb-2">Scan for Access</h3>
                            <p className="text-xs text-brand-muted mb-3">Use your physical membership card</p>
                            <button
                                type="button"
                                onClick={() => setShowQRScanner(true)}
                                className="w-full bg-brand-brown/5 hover:bg-brand-brown/10 text-brand-brown font-bold py-2 px-4 rounded-lg text-xs uppercase tracking-widest transition-colors"
                            >
                                Scan QR Code
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Scanner Modal */}
            {showQRScanner && (
                <div className="fixed inset-0 bg-brand-brown/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-auto">
                        <button
                            onClick={() => setShowQRScanner(false)}
                            className="absolute top-4 right-4 text-brand-muted hover:text-brand-brown"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mt-2 text-center">
                            <h3 className="text-lg font-serif font-bold text-brand-brown mb-6">Scan Membership Card</h3>
                            <div id="qr-reader" className="w-full overflow-hidden rounded-xl border-2 border-brand-gold/30"></div>
                            <p className="mt-4 text-xs text-brand-muted">Align your QR code within the frame</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
