import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Book, Calendar, User } from 'lucide-react';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [filters, setFilters] = useState({ title: '', genre: '', year: '' });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const genres = ["Fiction", "Non-fiction", "Science-fiction", "Fantasy", "Biographies", "Essais", "Manuels et guides", "Littérature jeunesse", "Histoires d’horreur", "Romans graphiques"];

    useEffect(() => {
        fetchBooks();
    }, [filters]);

    const fetchBooks = async () => {
        // Debounce could be added here
        setLoading(true);
        const params = new URLSearchParams(filters).toString();
        try {
            const { data } = await api.get(`/books?${params}`);
            setBooks(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Function to generate a deterministic gradient based on book title string
    const getBookGradient = (title) => {
        const colors = [
            'from-pink-400 to-rose-500',
            'from-emerald-400 to-teal-500',
            'from-orange-400 to-amber-500',
            'from-indigo-400 to-purple-500',
            'from-blue-400 to-cyan-500'
        ];
        const index = title.length % colors.length;
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
                    <button className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                        <Book className="h-5 w-5" />
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
                        {/* Cover Art Placeholder */}
                        <div className={`h-48 w-full bg-gradient-to-br ${getBookGradient(book.title)} relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                                    {book.genre}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 line-clamp-2" title={book.title}>{book.title}</h3>

                            <div className="space-y-2 mb-4 flex-1">
                                <div className="flex items-center text-sm text-gray-600">
                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="truncate">{book.author}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>{book.year}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${book.status === 'AVAILABLE'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                                    }`}>
                                    {book.status === 'AVAILABLE' ? 'Available' : 'Unavailable'}
                                </span>

                                {/* Role specific action */}
                                {book.status === 'AVAILABLE' && (
                                    <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                                        Borrow
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
        </div>
    );
};

export default BookList;
