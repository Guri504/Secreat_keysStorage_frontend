"use client";

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';
import { apiCall } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

import ChangePasswordModal from '../../components/ChangePasswordModal';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Settings() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleDeleteAccount = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await apiCall('/auth/delete-account', 'DELETE', {}, token);

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.success('Account deleted successfully');
            router.push('/login');
        } catch (error: any) {
            toast.error(error || 'Failed to delete account');
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-[url('/bg-abstract.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
            <Navbar />

            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
                    {/* Left Column: Header + Profile */}
                    <div className="space-y-6 md:sticky md:top-24 h-fit animate-fade-in-up">
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Account Settings</h1>

                        {/* Profile Card */}
                        <div className="glass p-6 rounded-2xl">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-indigo-500/30 mb-4 border-4 border-white/10">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-xl font-bold text-white capitalize mb-1">{user?.username}</h2>
                                <p className="text-sm text-gray-400 break-all">{user?.email}</p>

                                <div className="mt-6 w-full pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                                        <span>Member since</span>
                                        <span className="text-white">Dec 2024</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-400">
                                        <span>Plan</span>
                                        <span className="text-indigo-400 font-medium">Free Tier</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Sections */}
                    <div className="space-y-6 animate-fade-in-up delay-75 md:mt-16">
                        {/* Security Section */}
                        <div className="glass p-6 md:p-8 rounded-2xl">
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <span className="text-indigo-400">🛡️</span> Security
                            </h3>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="w-full group bg-black/20 hover:bg-black/40 border border-white/5 hover:border-indigo-500/50 rounded-xl p-4 transition-all duration-300 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                            🔑
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-white group-hover:text-indigo-400 transition-colors">Change Password</div>
                                            <div className="text-xs text-gray-500">Update your login credentials</div>
                                        </div>
                                    </div>
                                    <span className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
                                </button>
                                <button
                                    onClick={() => alert("Feature coming soon!")}
                                    className="w-full group bg-black/20 hover:bg-black/40 border border-white/5 hover:border-indigo-500/50 rounded-xl p-4 transition-all duration-300 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                            📱
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-white group-hover:text-indigo-400 transition-colors">Two-Factor Auth</div>
                                            <div className="text-xs text-gray-500">Add an extra layer of security</div>
                                        </div>
                                    </div>
                                    <span className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
                                </button>
                            </div>
                        </div>

                        {/* Preferences Section */}
                        <div className="glass p-6 md:p-8 rounded-2xl">
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <span className="text-indigo-400">⚙️</span> Preferences
                            </h3>
                            <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                        🌙
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">Dark Mode</h4>
                                        <p className="text-xs text-gray-500">Application theme</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                                    Always On
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="glass p-6 md:p-8 rounded-2xl border-red-500/20">
                            <h3 className="text-xl font-semibold text-red-400 mb-6 flex items-center gap-2">
                                <span>⚠️</span> Danger Zone
                            </h3>
                            <div className="flex items-center justify-between text-sm">
                                <div className="text-gray-400">
                                    Permanently remove your account and all data.
                                </div>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all font-medium"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />

            <ConfirmDialog
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteAccount}
                title="Delete Account"
                message="Are you sure you want to permanently delete your account? This action cannot be undone and all your stored secrets will be lost forever."
                confirmText="Delete Account"
                isDestructive={true}
            />
        </div>
    );
}
