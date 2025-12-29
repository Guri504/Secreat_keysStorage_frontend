"use client";

import Image from 'next/image';
import { useState } from 'react';

interface ViewSecretModalProps {
    isOpen: boolean;
    onClose: () => void;
    secret: {
        _id: string;
        title: string;
        value: string;
        type: string;
        description?: string;
        fileUrl?: string; // Assuming the backend returns fileUrl
    } | null;
}

export default function ViewSecretModal({ isOpen, onClose, secret }: ViewSecretModalProps) {
    const [isRevealed, setIsRevealed] = useState(false);

    if (!isOpen || !secret) return null;

    const isImage = (url: string) => {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="glass w-full max-w-lg rounded-2xl flex flex-col max-h-[90vh] shadow-2xl animate-scale-in">
                <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            {secret.title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                            ${secret.type === 'password' ? 'bg-red-500/10 text-red-400' :
                                    secret.type === 'key' ? 'bg-yellow-500/10 text-yellow-400' :
                                        secret.type === 'file' ? 'bg-blue-500/10 text-blue-400' :
                                            'bg-gray-500/10 text-gray-400'}`}>
                                {secret.type}
                            </span>
                        </div>

                        {secret.description && (
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <p className="text-gray-200">{secret.description}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Secret Value</label>
                            <div className="relative group/code">
                                <div className="bg-black/30 p-4 rounded-xl font-mono text-sm text-gray-300 break-all border border-white/5">
                                    {isRevealed ? secret.value : '•'.repeat(secret.value.length || 12)}
                                </div>
                                <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 md:group-hover/code:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setIsRevealed(!isRevealed)}
                                        className="p-1.5 bg-gray-700/80 hover:bg-gray-600 rounded text-xs text-white backdrop-blur-sm"
                                    >
                                        {isRevealed ? 'Hide' : 'Show'}
                                    </button>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(secret.value)}
                                        className="p-1.5 bg-gray-700/80 hover:bg-gray-600 rounded text-xs text-white backdrop-blur-sm"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </div>

                        {secret.fileUrl && (
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Attachment</label>
                                <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
                                    {isImage(secret.fileUrl) ? (
                                        <div className="relative w-full aspect-video md:h-80 md:aspect-auto bg-black/50">
                                            <Image
                                                src={secret.fileUrl}
                                                alt="Secret attachment"
                                                fill
                                                className="object-contain" // Use object-contain to show full image without cropping
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    ) : (
                                        <div className="p-6 flex flex-col items-center justify-center gap-3">
                                            <div className="text-6xl">📄</div>
                                            <a
                                                href={secret.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                                            >
                                                Download Attachment ↗
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
