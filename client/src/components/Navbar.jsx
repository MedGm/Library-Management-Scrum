import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Library, BookOpen, Clock, User, Menu } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavLink = ({ to, icon: Icon, children }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
                {Icon && <Icon className={`h-4 w-4 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />}
                <span>{children}</span>
            </Link>
        );
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-3 group">
                            <div className="bg-primary-600 rounded-lg p-2 text-white shadow-lg group-hover:scale-105 transition-transform">
                                <Library className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                LibraryMgr
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <NavLink to="/books" icon={BookOpen}>Catalog</NavLink>

                                {user.role === 'LIBRARIAN' || user.role === 'ADMIN' ? (
                                    <NavLink to="/borrowings" icon={Clock}>Manage Borrowings</NavLink>
                                ) : (
                                    <NavLink to="/my-borrowings" icon={Clock}>My Books</NavLink>
                                )}

                                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                                <div className="flex items-center space-x-3 pl-2">
                                    <div className="flex flex-col text-right">
                                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                        <span className="text-xs text-primary-600 font-semibold uppercase">{user.role.toLowerCase()}</span>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 border border-primary-200">
                                        <User className="h-5 w-5" />
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </>
                        ) : (
                            <div className="space-x-4 flex items-center">
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Log in</Link>
                                <Link to="/register" className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-500 hover:text-gray-900 focus:outline-none"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Placeholder (simplified) */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/books" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Catalog</Link>
                        <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Sign Out</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
