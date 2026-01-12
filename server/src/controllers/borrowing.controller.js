const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: Get System Setting
const getSetting = async (key, defaultValue) => {
    const setting = await prisma.systemSetting.findUnique({ where: { key } });
    return setting ? parseFloat(setting.value) : defaultValue;
};

// Create Borrowing (Librarian)
exports.createBorrowing = async (req, res) => {
    try {
        const { userId, bookId, dueDate } = req.body;

        // 1. Check Max Loans Rule
        const maxLoans = await getSetting('MAX_LOANS', 5);
        const activeLoans = await prisma.borrowing.count({
            where: { userId: parseInt(userId), returnDate: null }
        });

        if (activeLoans >= maxLoans) {
            return res.status(400).json({ error: `User has reached maximum active loans (${maxLoans})` });
        }

        // 2. Check Book Availability (Stock)
        const book = await prisma.book.findUnique({ where: { id: parseInt(bookId) } });
        if (!book || book.available < 1) {
            return res.status(400).json({ error: 'Book is out of stock' });
        }

        // Transaction to ensure atomic update
        const borrowing = await prisma.$transaction(async (tx) => {
            // Decrement Stock
            await tx.book.update({
                where: { id: parseInt(bookId) },
                data: { available: { decrement: 1 } }
            });

            // Create Borrowing
            return await tx.borrowing.create({
                data: {
                    userId: parseInt(userId),
                    bookId: parseInt(bookId),
                    dueDate: new Date(dueDate),
                    status: 'ACTIVE'
                }
            });
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

        // Calculate Penalty
        const now = new Date();
        const due = new Date(borrowing.dueDate);
        let penalty = 0;
        let status = 'RETURNED';

        if (now > due) {
            const diffTime = Math.abs(now - due);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const penaltyPerDay = await getSetting('PENALTY_PER_DAY', 1.0);
            penalty = diffDays * penaltyPerDay;
            status = 'RETURNED_LATE';
        }

        const updatedBorrowing = await prisma.$transaction(async (tx) => {
            // Increment Stock
            await tx.book.update({
                where: { id: borrowing.bookId },
                data: { available: { increment: 1 } }
            });

            // Update Borrowing
            return await tx.borrowing.update({
                where: { id: parseInt(id) },
                data: {
                    returnDate: now,
                    status,
                    penalty
                }
            });
        });

        res.json(updatedBorrowing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to return book' });
    }
};

// Renew Borrowing (Sprint 1)
exports.renewBorrowing = async (req, res) => {
    try {
        const { id } = req.params;
        const borrowing = await prisma.borrowing.findUnique({ where: { id: parseInt(id) } });

        if (!borrowing) return res.status(404).json({ error: 'Not found' });
        if (borrowing.returnDate) return res.status(400).json({ error: 'Cannot renew returned book' });
        if (borrowing.renewals >= 1) return res.status(400).json({ error: 'Max renewals reached' });

        // Extend due date by loan period setting (default 14 days)
        const loanDays = await getSetting('LOAN_DAYS', 14);
        const newDueDate = new Date(borrowing.dueDate);
        newDueDate.setDate(newDueDate.getDate() + loanDays);

        const updated = await prisma.borrowing.update({
            where: { id: parseInt(id) },
            data: {
                dueDate: newDueDate,
                renewals: { increment: 1 }
            }
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Renewal failed' });
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
