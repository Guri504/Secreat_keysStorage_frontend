"use client";

import { useState } from 'react';
import { apiCall } from '../lib/api';
import { useToast } from '../context/ToastContext';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            await apiCall('/auth/update-password', 'PUT', { currentPassword, newPassword }, token!);
            toast.success('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onClose();
        } catch (error: any) {
            toast.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="glass w-full max-w-md rounded-2xl flex flex-col max-h-[90vh] shadow-2xl animate-scale-in">
                <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl font-bold mb-6 text-white">Change Password</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                            <input
                                type="password"
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 text-white"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 rounded-lg bg-primary hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
