
import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Book, Calendar, User, X, Plus, Users } from 'lucide-react';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [filters, setFilters] = useState({ title: '', genre: '', year: '' });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Add Book Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '', author: '', category: '', publishedYear: '', isbn: '', stock: 1, coverUrl: ''
    });

    // Borrow Modal State
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [members, setMembers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    const genres = ["Fiction", "Non-fiction", "Science-fiction", "Fantasy", "Biographies", "Essais", "Manuels et guides", "Littérature jeunesse", "Histoires d’horreur", "Romans graphiques"];

    useEffect(() => {
        fetchBooks();
    }, [filters]);

    const fetchBooks = async () => {
        setLoading(true);
        const params = new URLSearchParams({
            title: filters.title,
            category: filters.genre,
            publishedYear: filters.year
        }).toString();
        try {
            const { data } = await api.get(`/books?${params}`);
            setBooks(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const { data } = await api.get('/users/members');
            setMembers(data);
        } catch (error) {
            console.error("Failed to fetch members", error);
            alert("Failed to load members list");
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleReserve = async (bookId) => {
        try {
            await api.post('/reservations', { bookId });
            alert('Reservation created successfully! You will be notified when it becomes available.');
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to reserve book');
        }
    };

    const openBorrowModal = (bookId) => {
        setSelectedBookId(bookId);
        setSelectedUserId('');
        setIsBorrowModalOpen(true);
        fetchMembers();
    };

    const handleConfirmBorrow = async (e) => {
        e.preventDefault();
        if (!selectedUserId) {
            alert("Please select a member.");
            return;
        }

        // Default due date: 14 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        try {
            await api.post('/borrowings', {
                userId: parseInt(selectedUserId),
                bookId: selectedBookId,
                dueDate: dueDate.toISOString()
            });
            alert('Book borrowed successfully!');
            setIsBorrowModalOpen(false);
            fetchBooks(); // Refresh to update stock
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to borrow book');
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await api.post('/books', {
                ...newBook,
                publishedYear: parseInt(newBook.publishedYear),
                stock: parseInt(newBook.stock),
                available: parseInt(newBook.stock)
            });
            alert('Book added successfully!');
            setIsModalOpen(false);
            setNewBook({ title: '', author: '', category: '', publishedYear: '', isbn: '', stock: 1, coverUrl: '' });
            fetchBooks();
        } catch (error) {
            console.error(error);
            alert('Failed to add book');
        }
    };

    const getBookGradient = (title) => {
        const colors = [
            'from-pink-400 to-rose-500',
            'from-emerald-400 to-teal-500',
            'from-orange-400 to-amber-500',
            'from-indigo-400 to-purple-500',
            'from-blue-400 to-cyan-500'
        ];
        // Safe check for title
        const safeTitle = title || "Book";
        const index = safeTitle.length % colors.length;
        return colors[index];
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Library Catalog</h1>
                    <p className="mt-1 text-gray-500">Explore our vast collection of {books.length} items</p>
                </div>
                {(user?.role === 'LIBRARIAN' || user?.role === 'ADMIN') && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Book
                    </button>
                )}
            </div>

            {/* Filter Bar */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-soft border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold pb-2 border-b border-gray-100">
                    <Filter className="h-5 w-5" /> Filters
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            name="title"
                            placeholder="Search by Title..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out shadow-sm hover:border-gray-300"
                            value={filters.title}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="relative">
                        <select
                            name="genre"
                            className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg shadow-sm hover:border-gray-300 transition duration-150 ease-in-out bg-white appearance-none"
                            value={filters.genre}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Genres</option>
                            {genres.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                        <input
                            type="number"
                            name="year"
                            placeholder="Publication Year..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out shadow-sm hover:border-gray-300"
                            value={filters.year}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {books.map((book) => (
                    <div key={book.id} className="group bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                        {/* Cover Art */}
                        <div className="h-64 w-full bg-gray-200 relative overflow-hidden">
                            {book.coverUrl ? (
                                <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className={`h - full w - full bg - gradient - to - br ${getBookGradient(book.title)} flex items - center justify - center`}>
                                    <Book className="h-12 w-12 text-white/50" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <span className="text-white text-xs font-bold uppercase tracking-wider bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                                    {book.category}
                                </span>
                            </div>

                            {/* Availability Badge Overlay */}
                            <div className="absolute top-2 right-2">
                                <span className={`inline - flex items - center px - 2 py - 1 rounded - full text - xs font - bold shadow - sm ${book.available > 0
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                    } `}>
                                    {book.available > 0 ? `${book.available} Available` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 line-clamp-2" title={book.title}>{book.title}</h3>
                            <p className="text-sm text-gray-500 mb-3">{book.author}</p>

                            <div className="flex items-center text-xs text-gray-400 mb-4">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{book.publishedYear}</span>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                {/* Role specific action */}
                                {book.available > 0 ? (
                                    (user?.role === 'LIBRARIAN' || user?.role === 'ADMIN') ? (
                                        <button
                                            onClick={() => openBorrowModal(book.id)}
                                            className="flex-1 bg-primary-50 text-primary-700 hover:bg-primary-100 py-2 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            Borrow Now
                                        </button>
                                    ) : (
                                        <span className="flex-1 text-center text-sm font-medium text-green-600 bg-green-50 py-2 rounded-lg">Available in Library</span>
                                    )
                                ) : (
                                    <button
                                        onClick={() => handleReserve(book.id)}
                                        className="flex-1 bg-amber-50 text-amber-700 hover:bg-amber-100 py-2 rounded-lg text-sm font-semibold transition-colors border border-amber-200"
                                    >
                                        Reserve
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && books.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex h-20 w-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No books found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search query.</p>
                </div>
            )}

            {/* Add Book Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                        <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <form onSubmit={handleAddBook}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Book</h3>
                                        <button onClick={() => setIsModalOpen(false)} type="button" className="text-gray-400 hover:text-gray-500">
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Title</label>
                                            <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Author</label>
                                            <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                                <select required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                    value={newBook.category} onChange={e => setNewBook({ ...newBook, category: e.target.value })}>
                                                    <option value="">Select...</option>
                                                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Year</label>
                                                <input required type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                    value={newBook.publishedYear} onChange={e => setNewBook({ ...newBook, publishedYear: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">ISBN</label>
                                                <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                    value={newBook.isbn} onChange={e => setNewBook({ ...newBook, isbn: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Stock</label>
                                                <input required type="number" min="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                    value={newBook.stock} onChange={e => setNewBook({ ...newBook, stock: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cover URL</label>
                                            <input type="url" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                value={newBook.coverUrl} onChange={e => setNewBook({ ...newBook, coverUrl: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">
                                        Add Book
                                    </button>
                                    <button onClick={() => setIsModalOpen(false)} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Borrow Modal */}
            {isBorrowModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                        <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <form onSubmit={handleConfirmBorrow}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Loan</h3>
                                        <button onClick={() => setIsBorrowModalOpen(false)} type="button" className="text-gray-400 hover:text-gray-500">
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Select Member</label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Users className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <select
                                                    required
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                    value={selectedUserId}
                                                    onChange={e => setSelectedUserId(e.target.value)}
                                                >
                                                    <option value="">-- Select a Member --</option>
                                                    {members.map(member => (
                                                        <option key={member.id} value={member.id}>
                                                            {member.name} ({member.email})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500">
                                                Only users with the MEMBER role are displayed here.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">
                                        Confirm Loan
                                    </button>
                                    <button onClick={() => setIsBorrowModalOpen(false)} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookList;
