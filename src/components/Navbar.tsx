"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setIsMobileMenuOpen(false);
        router.push('/login');
    };

    return (
        <nav className="glass border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            SecretVault
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                                    Dashboard
                                </Link>
                                <Link href="/settings" className="text-sm font-medium hover:text-primary transition-colors">
                                    Settings
                                </Link>
                                <Link href="/activity" className="text-sm font-medium hover:text-primary transition-colors">
                                    Activity
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-all"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#0f172a] border-t border-border animate-fade-in absolute w-full shadow-2xl">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/settings"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                                >
                                    Settings
                                </Link>
                                <Link
                                    href="/activity"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                                >
                                    Activity
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-primary/10"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
