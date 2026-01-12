import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, AlertTriangle, CheckCircle, TrendingUp, X } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ borrowings: [], reservations: [] });
    const [loading, setLoading] = useState(true);

    // Return Modal State
    const [returnModal, setReturnModal] = useState({ isOpen: false, borrowing: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.role === 'ADMIN' || user.role === 'LIBRARIAN') {
                    const { data } = await api.get('/borrowings');
                    setStats({ borrowings: data, reservations: [] });
                } else {
                    const [borrowRes, reserveRes] = await Promise.all([
                        api.get('/borrowings/my'),
                        api.get('/reservations/my')
                    ]);
                    setStats({ borrowings: borrowRes.data, reservations: reserveRes.data });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleCancelReservation = async (id) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;
        try {
            await api.delete(`/reservations/${id}`);
            // Optimistic update
            setStats(prev => ({
                ...prev,
                reservations: prev.reservations.filter(r => r.id !== id)
            }));
        } catch (error) {
            console.error(error);
            alert('Failed to cancel reservation');
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    const openReturnModal = (borrowing) => {
        setReturnModal({ isOpen: true, borrowing });
    };

    const handleConfirmReturn = async () => {
        if (!returnModal.borrowing) return;

        try {
            const { data } = await api.put(`/borrowings/${returnModal.borrowing.id}/return`);
            setReturnModal({ isOpen: false, borrowing: null });

            if (data.penalty > 0) {
                alert(`⚠️ LATE RETURN DETECTED!\n\nPenalty Fee: $${data.penalty.toFixed(2)}\nStatus: ${data.status}`);
            } else {
                alert('Book returned successfully.');
            }
            // Refresh data
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Failed to return book');
        }
    };

    const handleRenew = async (id) => {
        try {
            await api.put(`/borrowings/${id}/renew`);
            alert('Loan renewed successfully! Due date extended.');
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to renew loan');
        }
    };

    const activeCount = stats.borrowings.filter(b => !b.returnDate).length;
    const overdueCount = stats.borrowings.filter(b => !b.returnDate && new Date(b.dueDate) < new Date()).length;
    const reservationCount = stats.reservations ? stats.reservations.length : 0;


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
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Reservations</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{reservationCount}</p>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                        <Clock className="h-6 w-6" />
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
                                                    {/* Book Cover */}
                                                    {b.book?.coverUrl ? (
                                                        <img src={b.book.coverUrl} className="h-full w-full object-cover" alt="Cover" />
                                                    ) : (
                                                        <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                                            <BookOpen className="h-4 w-4 text-white/50" />
                                                        </div>
                                                    )}
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
                                                    <button
                                                        onClick={() => openReturnModal(b)}
                                                        className="text-primary-600 hover:text-primary-900 hover:underline text-xs"
                                                    >
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

            {/* Reservations Table */}
            {stats.reservations && stats.reservations.length > 0 && (
                <div className="mt-8 bg-white shadow-soft rounded-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-gray-400" />
                            Active Reservations
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reserved Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stats.reservations.map((r) => (
                                    <tr key={r.id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-8 bg-gray-200 rounded flex-shrink-0 mr-3 overflow-hidden">
                                                    {r.book?.coverUrl ? (
                                                        <img src={r.book.coverUrl} className="h-full w-full object-cover" alt="Cover" />
                                                    ) : (
                                                        <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{r.book?.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Waiting
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleCancelReservation(r.id)}
                                                className="text-red-600 hover:text-red-900 text-xs font-semibold"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Return Modal */}
            {returnModal.isOpen && returnModal.borrowing && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                        <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Book Return</h3>
                                    <button onClick={() => setReturnModal({ isOpen: false, borrowing: null })} type="button" className="text-gray-400 hover:text-gray-500">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to mark this book as returned?
                                    </p>
                                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                                        <p className="text-sm font-medium text-gray-900">Book: <span className="font-normal">{returnModal.borrowing.book?.title}</span></p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">Borrower: <span className="font-normal">{returnModal.borrowing.user?.name}</span></p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">Due Date: <span className={`font-normal ${new Date(returnModal.borrowing.dueDate) < new Date() ? 'text-red-600' : 'text-gray-700'}`}>
                                            {new Date(returnModal.borrowing.dueDate).toLocaleDateString()}
                                            {new Date(returnModal.borrowing.dueDate) < new Date() && " (Overdue)"}
                                        </span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleConfirmReturn}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Confirm Return
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setReturnModal({ isOpen: false, borrowing: null })}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
