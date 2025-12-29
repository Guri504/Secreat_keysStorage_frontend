import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '../context/ToastContext';

export const metadata: Metadata = {
    title: 'SecretVault',
    description: 'Secure storage for your secrets',
};

import Footer from '../components/Footer';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                <ToastProvider>
                    {children}
                    <Footer />
                </ToastProvider>
            </body>
        </html>
    );
}
