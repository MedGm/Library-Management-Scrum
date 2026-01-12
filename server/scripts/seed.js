const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Password for all users: 'password123'
    const password = await bcrypt.hash('password123', 10);

    // 1. Create Users
    const admin = await prisma.user.upsert({
        where: { email: 'admin@library.com' },
        update: {},
        create: {
            email: 'admin@library.com',
            name: 'Admin User',
            role: 'ADMIN',
            password
        }
    });

    const librarian = await prisma.user.upsert({
        where: { email: 'biblio@library.com' },
        update: {},
        create: {
            email: 'biblio@library.com',
            name: 'Bibliothécaire',
            role: 'LIBRARIAN',
            password
        }
    });

    const member = await prisma.user.upsert({
        where: { email: 'student@school.com' },
        update: {},
        create: {
            email: 'student@school.com',
            name: 'Étudiant Modèle',
            role: 'MEMBER',
            password
        }
    });

    console.log('Users seeded.');

    // 2. Create Books
    const booksData = [
        { title: "Clean Code", author: "Robert C. Martin", genre: "Manuels et guides", year: 2008 },
        { title: "The Pragmatic Programmer", author: "Andy Hunt", genre: "Manuels et guides", year: 1999 },
        { title: "1984", author: "George Orwell", genre: "Fiction", year: 1949 },
        { title: "Dune", author: "Frank Herbert", genre: "Science-fiction", year: 1965 },
        { title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien", genre: "Fantasy", year: 1954 },
        { title: "Steve Jobs", author: "Walter Isaacson", genre: "Biographies", year: 2011 },
        { title: "Sapiens", author: "Yuval Noah Harari", genre: "Essais", year: 2011 },
        { title: "Harry Potter à l'école des sorciers", author: "J.K. Rowling", genre: "Littérature jeunesse", year: 1997 },
        { title: "Ça", author: "Stephen King", genre: "Histoires d’horreur", year: 1986 },
        { title: "Maus", author: "Art Spiegelman", genre: "Romans graphiques", year: 1991 },
    ];

    for (const book of booksData) {
        await prisma.book.create({ data: book });
    }

    console.log('Books seeded.');

    // 3. Create active borrowing
    await prisma.borrowing.create({
        data: {
            userId: member.id,
            bookId: 1, // Clean Code
            dueDate: new Date(new Date().setDate(new Date().getDate() + 14)) // +14 days
        }
    });

    // Update Clean Code status
    await prisma.book.update({
        where: { id: 1 },
        data: { status: 'BORROWED' }
    });

    console.log('Borrowing seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
