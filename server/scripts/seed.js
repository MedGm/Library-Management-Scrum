const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database for Sprint 1...');

    // Password for all users: 'password123'
    const password = await bcrypt.hash('password123', 10);

    // 1. Create Users
    const admin = await prisma.user.upsert({
        where: { email: 'admin@library.com' },
        update: {},
        create: { email: 'admin@library.com', name: 'Admin User', role: 'ADMIN', password }
    });

    const librarian = await prisma.user.upsert({
        where: { email: 'biblio@library.com' },
        update: {},
        create: { email: 'biblio@library.com', name: 'Bibliothécaire', role: 'LIBRARIAN', password }
    });

    const member = await prisma.user.upsert({
        where: { email: 'student@school.com' },
        update: {},
        create: { email: 'student@school.com', name: 'Étudiant Modèle', role: 'MEMBER', password }
    });

    const member2 = await prisma.user.upsert({
        where: { email: 'alice@school.com' },
        update: {},
        create: { email: 'alice@school.com', name: 'Alice Wonderland', role: 'MEMBER', password }
    });

    const member3 = await prisma.user.upsert({
        where: { email: 'bob@school.com' },
        update: {},
        create: { email: 'bob@school.com', name: 'Bob Builder', role: 'MEMBER', password }
    });

    console.log('Users seeded.');

    // 2. System Settings (Sprint 1)
    await prisma.systemSetting.upsert({ where: { key: 'MAX_LOANS' }, update: {}, create: { key: 'MAX_LOANS', value: '5' } });
    await prisma.systemSetting.upsert({ where: { key: 'LOAN_DAYS' }, update: {}, create: { key: 'LOAN_DAYS', value: '14' } });
    await prisma.systemSetting.upsert({ where: { key: 'PENALTY_PER_DAY' }, update: {}, create: { key: 'PENALTY_PER_DAY', value: '1.5' } });

    console.log('System Settings seeded.');

    // 3. Clear existing data to avoid conflicts on re-seed strategies involving unique constraints
    // (In production, we would be more careful, but for dev seeding this is fine)
    await prisma.borrowing.deleteMany({});
    await prisma.reservation.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.book.deleteMany({});

    // 4. Create Books
    const booksData = [
        { title: "Clean Code", author: "Robert C. Martin", category: "Manuels et guides", publishedYear: 2008, isbn: "978-0132350884", stock: 5, available: 4, coverUrl: "https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg" },
        { title: "The Pragmatic Programmer", author: "Andy Hunt", category: "Manuels et guides", publishedYear: 1999, isbn: "978-0201616224", stock: 3, available: 2, coverUrl: "https://m.media-amazon.com/images/I/51W1sBPO7tL._SX380_BO1,204,203,200_.jpg" },
        { title: "1984", author: "George Orwell", category: "Fiction", publishedYear: 1949, isbn: "978-0451524935", stock: 10, available: 8, coverUrl: "https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg" },
        { title: "Dune", author: "Frank Herbert", category: "Science-fiction", publishedYear: 1965, isbn: "978-0441013593", stock: 4, available: 4, coverUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg" },
        { title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien", category: "Fantasy", publishedYear: 1954, isbn: "978-0618640157", stock: 2, available: 2, coverUrl: "https://m.media-amazon.com/images/I/71jLBXtWJWL._AC_UF1000,1000_QL80_.jpg" },
        { title: "Harry Potter à l'école des sorciers", author: "J.K. Rowling", category: "Fantasy", publishedYear: 1997, isbn: "978-0747532699", stock: 5, available: 0, coverUrl: "https://booksondemand.ma/cdn/shop/files/916DM68L6cS-min.jpg?v=1692956637" }, // Out of stock to test reservations
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", publishedYear: 1925, isbn: "978-0743273565", stock: 4, available: 4, coverUrl: "https://m.media-amazon.com/images/I/71FTb9X6wsL.jpg" },
        { title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", category: "Essais", publishedYear: 2011, isbn: "978-0062316097", stock: 6, available: 6, coverUrl: "https://m.media-amazon.com/images/I/713jIoMO3UL.jpg" },
        { title: "Introduction to Algorithms", author: "T.H. Cormen", category: "Manuels et guides", publishedYear: 2009, isbn: "978-0262033848", stock: 2, available: 2, coverUrl: "https://m.media-amazon.com/images/I/61Mw06x2XcL.jpg" }
    ];

    const createdBooks = [];
    for (const book of booksData) {
        const b = await prisma.book.create({ data: book });
        createdBooks.push(b);
    }
    console.log('Books seeded.');

    // 5. Create Borrowings & Reservations

    // Scenario A: Standard active loan (Member 1 -> Clean Code)
    await prisma.borrowing.create({
        data: {
            userId: member.id,
            bookId: createdBooks[0].id,
            borrowDate: new Date(),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
            status: 'ACTIVE'
        }
    });

    // Scenario B: Overdue loan (Member 1 -> 1984)
    // Borrowed 20 days ago, Due 6 days ago
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 20);
    const overdueDueDate = new Date();
    overdueDueDate.setDate(overdueDueDate.getDate() - 6);

    await prisma.borrowing.create({
        data: {
            userId: member.id,
            bookId: createdBooks[2].id, // 1984
            borrowDate: overdueDate,
            dueDate: overdueDueDate,
            status: 'ACTIVE' // Should show as overdue
        }
    });

    // Scenario C: Returned Time (Member 2 -> Pragmatic Programmer)
    await prisma.borrowing.create({
        data: {
            userId: member2.id,
            bookId: createdBooks[1].id,
            borrowDate: new Date(new Date().setDate(new Date().getDate() - 10)),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 4)),
            returnDate: new Date(),
            status: 'RETURNED'
        }
    });

    // Scenario D: Active Reservation (Member 3 -> Harry Potter [Out of stock])
    await prisma.reservation.create({
        data: {
            userId: member3.id,
            bookId: createdBooks[5].id, // Harry Potter
            status: 'WAITING'
        }
    });

    // Scenario E: Another Active Loan (Member 2 -> 1984)
    await prisma.borrowing.create({
        data: {
            userId: member2.id,
            bookId: createdBooks[2].id, // 1984
            borrowDate: new Date(),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
            status: 'ACTIVE'
        }
    });

    console.log('Borrowings and Reservations seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
