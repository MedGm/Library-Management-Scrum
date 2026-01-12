const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Reservation
exports.createReservation = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id; // From Auth Middleware

        // Check if book exists and is unavailable
        const book = await prisma.book.findUnique({ where: { id: parseInt(bookId) } });
        if (!book) return res.status(404).json({ error: 'Book not found' });

        // Only allow reservation if no stock is available (Sprint 1 Rule)
        if (book.available > 0) {
            return res.status(400).json({ error: 'Book is available, please borrow directly.' });
        }

        // Check for existing reservation
        const existing = await prisma.reservation.findFirst({
            where: {
                userId,
                bookId: parseInt(bookId),
                status: 'ACTIVE'
            }
        });
        if (existing) {
            return res.status(400).json({ error: 'You already have an active reservation for this book.' });
        }

        const reservation = await prisma.reservation.create({
            data: {
                userId,
                bookId: parseInt(bookId)
            }
        });

        res.status(201).json(reservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create reservation' });
    }
};

// Get My Reservations
exports.getMyReservations = async (req, res) => {
    try {
        const reservations = await prisma.reservation.findMany({
            where: { userId: req.user.id, status: 'ACTIVE' },
            include: { book: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
};

// Cancel Reservation
exports.cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await prisma.reservation.findUnique({ where: { id: parseInt(id) } });

        if (!reservation) return res.status(404).json({ error: 'Not found' });
        if (reservation.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        await prisma.reservation.update({
            where: { id: parseInt(id) },
            data: { status: 'CANCELLED' }
        });

        res.json({ message: 'Reservation cancelled' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel reservation' });
    }
};
