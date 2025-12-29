export default function Footer() {
    return (
        <footer className="w-full py-6 mt-auto border-t border-white/10 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} SecretVault. All rights reserved.
                </div>
                <div className="flex gap-6">
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
}
