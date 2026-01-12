const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Borrowing (Librarian)
exports.createBorrowing = async (req, res) => {
    try {
        const { userId, bookId, dueDate } = req.body;

        // Check if book is available
        const book = await prisma.book.findUnique({ where: { id: parseInt(bookId) } });
        if (!book || book.status !== 'AVAILABLE') {
            return res.status(400).json({ error: 'Book is not available' });
        }

        const borrowing = await prisma.borrowing.create({
            data: {
                userId: parseInt(userId),
                bookId: parseInt(bookId),
                dueDate: new Date(dueDate)
            }
        });

        // Update book status
        await prisma.book.update({
            where: { id: parseInt(bookId) },
            data: { status: 'BORROWED' }
        });

        res.status(201).json(borrowing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create borrowing' });
    }
};

// Return book
exports.returnBook = async (req, res) => {
    try {
        const { id } = req.params;

        const borrowing = await prisma.borrowing.findUnique({ where: { id: parseInt(id) } });
        if (!borrowing) return res.status(404).json({ error: 'Borrowing not found' });
        if (borrowing.returnDate) return res.status(400).json({ error: 'Book already returned' });

        const updatedBorrowing = await prisma.borrowing.update({
            where: { id: parseInt(id) },
            data: { returnDate: new Date() }
        });

        // Update book status
        await prisma.book.update({
            where: { id: borrowing.bookId },
            data: { status: 'AVAILABLE' }
        });

        res.json(updatedBorrowing);
    } catch (error) {
        res.status(500).json({ error: 'Failed to return book' });
    }
};

// Get User Borrowings
exports.getMyBorrowings = async (req, res) => {
    try {
        const borrowings = await prisma.borrowing.findMany({
            where: { userId: req.user.id },
            include: { book: true },
            orderBy: { borrowDate: 'desc' }
        });
        res.json(borrowings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch borrowings' });
    }
};

// Get All Borrowings (Admin/Librarian)
exports.getAllBorrowings = async (req, res) => {
    try {
        const borrowings = await prisma.borrowing.findMany({
            include: { book: true, user: { select: { id: true, name: true, email: true } } },
            orderBy: { borrowDate: 'desc' }
        });
        res.json(borrowings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch all borrowings' });
    }
};
