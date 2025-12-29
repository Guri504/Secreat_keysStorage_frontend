"use client";

import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

interface SecretModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (secret: any) => Promise<void>;
    initialData?: any;
}

export default function SecretModal({ isOpen, onClose, onSubmit, initialData }: SecretModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        value: '',
        type: 'other',
        description: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ title: '', value: '', type: 'other', description: '' });
            setFile(null);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('value', formData.value);
        data.append('type', formData.type);
        data.append('description', formData.description);
        if (file) {
            data.append('file', file);
        }

        setIsLoading(true);
        try {
            await onSubmit(data);
            toast.success(initialData ? 'Secret updated successfully!' : 'Secret created successfully!');
            onClose();
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast.error(error.message || 'Failed to save secret');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="glass w-full max-w-lg rounded-2xl flex flex-col max-h-[90vh] shadow-2xl animate-scale-in">
                <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl font-bold mb-6 bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        {initialData ? 'Edit Secret' : 'New Secret'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500"
                                placeholder="e.g., Netflix Password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full bg-card/50 border border-border rounded-xl px-4 py-2.5 text-left text-white focus:ring-2 focus:ring-primary/50 flex justify-between items-center"
                                >
                                    <span className="capitalize">{formData.type}</span>
                                    <span className="text-gray-400">▼</span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                                        {[
                                            { value: 'password', label: 'Password' },
                                            { value: 'key', label: 'API Key' },
                                            { value: 'file', label: 'File Path' },
                                            { value: 'other', label: 'Other' }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, type: option.value });
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-primary/20 hover:text-white transition-colors"
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-400">Secret Value</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
                                        let pass = "";
                                        for (let i = 0; i < 16; i++) {
                                            pass += chars.charAt(Math.floor(Math.random() * chars.length));
                                        }
                                        setFormData({ ...formData, value: pass });
                                    }}
                                    className="text-xs text-primary hover:text-indigo-400 font-medium transition-colors"
                                >
                                    ✨ Generate Password
                                </button>
                            </div>
                            <textarea
                                required
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 text-white h-24 font-mono text-sm"
                                placeholder="Top secret content..."
                            />
                            {formData.value && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${formData.value.length < 8 ? 'w-1/4 bg-red-500' :
                                                formData.value.length < 12 ? 'w-1/2 bg-yellow-500' :
                                                    'w-full bg-green-500'
                                                }`}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {formData.value.length < 8 ? 'Weak' :
                                            formData.value.length < 12 ? 'Medium' :
                                                'Strong'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500"
                                placeholder="Optional notes"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Attachment</label>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                            />
                            {initialData?.fileUrl && !file && (
                                <div className="mt-2 text-xs">
                                    <a href={initialData.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        View Current Attachment
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 rounded-lg bg-primary hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    'Save Secret'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
