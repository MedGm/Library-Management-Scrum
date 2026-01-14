import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center space-y-8">
                {/* Logo & Hero */}
                <div className="flex flex-col items-center animate-fade-in-up">
                    <img src="/logo-app.png" alt="LibraryMgr Logo" className="w-32 h-32 mb-6 object-contain" />
                    <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                        Library<span className="text-indigo-600">Mgr</span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        A modern, efficient, and intelligent library management system designed for the next generation of libraries.
                    </p>
                </div>

                {/* Call to Action */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    <Link
                        to="/login"
                        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-all transform hover:-translate-y-1"
                    >
                        Create Account
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">📚</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Catalog</h3>
                        <p className="text-gray-600">Browse thousands of books with advanced filtering and real-time availability.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Borrowing</h3>
                        <p className="text-gray-600">Seamless borrowing process with automated penalty calculation for late returns.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">🛡️</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Admin Controls</h3>
                        <p className="text-gray-600">Powerful dashboard for librarians to manage rules, users, and audit logs.</p>
                    </div>
                </div>

                <footer className="mt-16 text-gray-500 text-sm">
                    &copy; 2026 LibraryMgr. Built by Agile Team.
                </footer>
            </div>
        </div>
    );
};

export default Home;
