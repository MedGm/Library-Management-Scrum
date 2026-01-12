const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all books with optional filters
exports.getAllBooks = async (req, res) => {
    try {
        const { title, author, genre, year, status } = req.query;

        // Build filter object
        const where = {};
        if (title) where.title = { contains: title };
        if (author) where.author = { contains: author };
        if (genre) where.genre = { equals: genre };
        if (year) where.year = { equals: parseInt(year) };
        if (status) where.status = { equals: status };

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
        const { title, author, genre, year } = req.body;
        const book = await prisma.book.create({
            data: {
                title,
                author,
                genre,
                year: parseInt(year),
                status: 'AVAILABLE'
            }
        });
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create book' });
    }
};

// Update book (Librarian/Admin)
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, genre, year, status } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (author) updateData.author = author;
        if (genre) updateData.genre = genre;
        if (year) updateData.year = parseInt(year);
        if (status) updateData.status = status;

        const book = await prisma.book.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
};
