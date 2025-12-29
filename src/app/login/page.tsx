"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiCall } from '../../lib/api';
import Navbar from '../../components/Navbar';
import { useToast } from '../../context/ToastContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await apiCall('/auth/login', 'POST', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ username: data.username, email: data.email }));
            router.push('/dashboard');
            toast.success('Welcome back!');
        } catch (err: any) {
            toast.error(err || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-[url('/bg-abstract.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <Navbar />

            <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
                <div className="glass p-8 rounded-2xl w-full max-w-md animate-fade-in-up">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400 mt-2">Enter your credentials to access your vault</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500 transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-primary hover:text-cyan-400 font-medium transition-colors">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
