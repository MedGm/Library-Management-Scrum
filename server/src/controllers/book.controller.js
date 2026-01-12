const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all books with optional filters
exports.getAllBooks = async (req, res) => {
    try {
        const { title, author, category, publishedYear, genre, year } = req.query;

        // Build filter object
        const where = {};
        if (title) where.title = { contains: title };
        if (author) where.author = { contains: author };

        // Support both old and new param names for compatibility
        if (category || genre) where.category = { equals: category || genre };
        if (publishedYear || year) where.publishedYear = { equals: parseInt(publishedYear || year) };

        // For Sprint 1, we might treat 'available' status as stock > 0
        // But for list filtering, usually we just show all or filter by category

        const books = await prisma.book.findMany({
            where,
            orderBy: { title: 'asc' }
        });

        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};

// Get single book
exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch book' });
    }
};

// Create book (Librarian only)
exports.createBook = async (req, res) => {
    try {
        const { title, author, category, publishedYear, isbn, stock, coverUrl } = req.body;
        const book = await prisma.book.create({
            data: {
                title,
                author,
                category,
                publishedYear: parseInt(publishedYear),
                isbn,
                stock: parseInt(stock),
                available: parseInt(stock), // Initially available = stock
                coverUrl
            }
        });
        res.status(201).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create book' });
    }
};

// Update book (Librarian/Admin)
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, category, publishedYear, stock, coverUrl, available } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (author) updateData.author = author;
        if (category) updateData.category = category;
        if (publishedYear) updateData.publishedYear = parseInt(publishedYear);
        if (stock) updateData.stock = parseInt(stock);
        if (coverUrl) updateData.coverUrl = coverUrl;
        if (available !== undefined) updateData.available = parseInt(available);

        const book = await prisma.book.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
};
