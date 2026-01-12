import Navbar from '../components/Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 w-full bg-slate-50">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} LibraryMgr. Project for Sprint 0.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
