import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ borrowings: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.role === 'ADMIN' || user.role === 'LIBRARIAN') {
                    const { data } = await api.get('/borrowings');
                    setStats({ borrowings: data });
                } else {
                    const { data } = await api.get('/borrowings/my');
                    setStats({ borrowings: data });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    const activeCount = stats.borrowings.filter(b => !b.returnDate).length;
    const overdueCount = stats.borrowings.filter(b => !b.returnDate && new Date(b.dueDate) < new Date()).length;
    const returnedCount = stats.borrowings.length - activeCount;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-gray-500">Welcome back, {user.name}. Here's what's happening.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Loans</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{activeCount}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <BookOpen className="h-6 w-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Overdue</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{overdueCount}</p>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">History</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{returnedCount}</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white shadow-soft rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                        {user.role === 'MEMBER' ? 'My Borrowing Activity' : 'Recent System Activity'}
                    </h3>
                    {user.role !== 'MEMBER' && (
                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">Live View</span>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Details</th>
                                {(user.role !== 'MEMBER') && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                {(user.role !== 'MEMBER') && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.borrowings.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No borrowing records found.
                                    </td>
                                </tr>
                            ) : (
                                stats.borrowings.map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-8 bg-gray-200 rounded flex-shrink-0 mr-3 overflow-hidden">
                                                    {/* Placeholder for book cover */}
                                                    <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                                        <BookOpen className="h-4 w-4 text-white/50" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{b.book?.title}</div>
                                                    <div className="text-xs text-gray-500">{b.book?.author}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {(user.role !== 'MEMBER') && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold mr-2">
                                                        {b.user?.name.charAt(0)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{b.user?.name}</div>
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-xs text-gray-500">
                                                <span className="block">Out: {new Date(b.borrowDate).toLocaleDateString()}</span>
                                                <span className={`block font-medium ${new Date(b.dueDate) < new Date() && !b.returnDate ? 'text-red-600' : 'text-gray-500'}`}>
                                                    Due: {new Date(b.dueDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {!b.returnDate ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5"></span>
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    Returned
                                                </span>
                                            )}
                                        </td>
                                        {(user.role !== 'MEMBER') && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {!b.returnDate && (
                                                    <button className="text-primary-600 hover:text-primary-900 hover:underline text-xs">
                                                        Mark Return
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
