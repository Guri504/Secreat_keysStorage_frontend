"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import SecretModal from '../../components/SecretModal';
import ViewSecretModal from '../../components/ViewSecretModal';
import { apiCall } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

interface Secret {
    _id: string;
    title: string;
    value: string;
    type: string;
    description?: string;
    fileUrl?: string; // Add fileUrl to interface
}

export default function Dashboard() {
    const [secrets, setSecrets] = useState<Secret[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingSecret, setEditingSecret] = useState<Secret | undefined>(undefined);
    const [viewingSecret, setViewingSecret] = useState<Secret | null>(null);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        const fetchSecrets = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const data = await apiCall('/secrets', 'GET', null, token);
                setSecrets(data);
            } catch (error: any) {
                toast.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSecrets();
    }, [router]);

    const handleCreate = async (data: any) => {
        const token = localStorage.getItem('token');
        try {
            const newSecret = await apiCall('/secrets', 'POST', data, token!);
            setSecrets([...secrets, newSecret]);
        } catch (error: any) {
            // Error is handled in Modal now, but if it propagates:
            throw error;
        }
    };

    const handleUpdate = async (data: any) => {
        const token = localStorage.getItem('token');
        try {
            const updated = await apiCall(`/secrets/${editingSecret?._id}`, 'PUT', data, token!);
            setSecrets(secrets.map((s) => (s._id === updated._id ? updated : s)));
        } catch (error: any) {
            throw error;
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this secret?')) return;
        const token = localStorage.getItem('token');
        try {
            await apiCall(`/secrets/${id}`, 'DELETE', null, token!);
            setSecrets(secrets.filter((s) => s._id !== id));
            toast.success('Secret deleted successfully');
        } catch (error: any) {
            toast.error(error);
        }
    };

    const openEditModal = (secret: Secret) => {
        setEditingSecret(secret);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[url('/bg-abstract.jpg')] bg-cover bg-center bg-fixed">
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
            <Navbar />

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-14">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 animate-fade-in-up">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">My Vault</h1>
                        <p className="text-gray-400 text-lg">Manage and secure your digital secrets.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingSecret(undefined);
                            setIsModalOpen(true);
                        }}
                        className="w-full sm:w-auto bg-linear-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                    >
                        <span className="text-xl group-hover:rotate-90 transition-transform duration-300">+</span> New Secret
                    </button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 glass rounded-3xl bg-white/5"></div>
                        ))}
                    </div>
                ) : secrets.length === 0 ? (
                    <div className="text-center py-24 animate-fade-in glass rounded-3xl border-dashed border-2 border-white/10">
                        <div className="text-6xl mb-4 opacity-50">📭</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your vault is empty</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">Start securing your passwords, keys, and notes by creating your first secret.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-medium transition-all"
                        >
                            Create First Secret
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-75">
                        {secrets.map((secret) => (
                            <div key={secret._id} className="glass p-6 rounded-3xl hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner
                                        ${secret.type === 'password' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' :
                                            secret.type === 'key' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                                secret.type === 'file' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' :
                                                    'bg-slate-500/20 text-slate-400 border border-slate-500/20'}`}>
                                        {secret.type === 'password' ? '🔑' :
                                            secret.type === 'key' ? '🗝️' :
                                                secret.type === 'file' ? '📁' : '📝'}
                                    </div>
                                    <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-x-2 md:group-hover:translate-x-0">
                                        <button
                                            onClick={() => {
                                                setViewingSecret(secret);
                                                setIsViewModalOpen(true);
                                            }}
                                            className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                                            title="View Details"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => openEditModal(secret)}
                                            className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(secret._id)}
                                            className="p-2 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-indigo-300 transition-colors">{secret.title}</h3>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">{secret.description || 'No description provided'}</p>

                                    <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5 flex items-center justify-between group/code relative overflow-hidden">
                                        <div className="font-mono text-sm text-gray-300 truncate mr-8">
                                            {secret.type === 'file' ? (
                                                <span className="flex items-center gap-2 text-xs">
                                                    📎 Attachment
                                                </span>
                                            ) : '••••••••••••••••'}
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(secret.value);
                                                toast.success('Copied to clipboard!');
                                            }}
                                            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-100 sm:opacity-0 sm:group-hover/code:opacity-100 focus:opacity-100"
                                            title="Copy"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        </button>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-medium uppercase tracking-wider">
                                        <span>{secret.type}</span>
                                        <span>Last updated</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <SecretModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingSecret ? handleUpdate : handleCreate}
                initialData={editingSecret}
            />

            <ViewSecretModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                secret={viewingSecret}
            />
        </div>
    );
}
