"use client";

import { Toast } from '../context/ToastContext';
import { useEffect, useState } from 'react';

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

const ToastItem = ({ toast, removeToast }: { toast: Toast; removeToast: (id: string) => void }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            removeToast(toast.id);
        }, 300); // Wait for exit animation
    };

    const icons = {
        success: (
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
        ),
        error: (
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        ),
        info: (
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0" />
                </svg>
            </div>
        ),
        warning: (
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
        )
    };

    const bgStyles = {
        success: 'bg-black/80 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]',
        error: 'bg-black/80 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
        info: 'bg-black/80 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        warning: 'bg-black/80 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
    };

    return (
        <div
            className={`
                min-w-[320px] max-w-sm backdrop-blur-md rounded-xl p-4 mb-3 flex items-start gap-4 border
                transition-all duration-300 ease-in-out cursor-pointer
                ${bgStyles[toast.type]}
                ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
            `}
            onClick={handleClose}
        >
            {icons[toast.type]}
            <div className="flex-1 pt-0.5">
                <h4 className="font-semibold text-white capitalize text-sm mb-0.5">{toast.type}</h4>
                <p className="text-gray-300 text-sm leading-tight">{toast.message}</p>
            </div>
        </div>
    );
};

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
                ))}
            </div>
        </div>
    );
}
