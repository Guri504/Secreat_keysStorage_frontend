import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
    return (
        <div className="min-h-screen bg-[url('/bg-abstract.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <Navbar />

            <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 min-h-[calc(100vh-64px)]">
                <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6 animate-fade-in-up">
                    Secure Your Secrets
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mb-10 animate-fade-in-up delay-100">
                    The most secure and premium vault for your passwords, API keys, and sensitive files.
                    Encrypted, accessible, and designed for you.
                </p>

                <div className="flex gap-4 animate-fade-in-up delay-200">
                    <Link
                        href="/register"
                        className="px-8 py-4 rounded-xl bg-primary hover:bg-indigo-500 text-white font-bold text-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:scale-[1.02]"
                    >
                        Get Started
                    </Link>
                    <Link
                        href="/login"
                        className="px-8 py-4 rounded-xl bg-card/50 border border-white/10 hover:bg-white/10 text-white font-bold text-lg transition-all backdrop-blur-md"
                    >
                        Login
                    </Link>
                </div>
            </main>
        </div>
    );
}
