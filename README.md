# Library Management System - Sprint 0 Deliverable

This repository contains the working source code for the "Sprint 0" increment of the Library Management Application.

## 📦 Project Structure

- **server/**: Node.js + Express + Prisma (SQLite Backend)
- **client/**: React + Vite + TailwindCSS (Frontend)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Setup Backend
```bash
cd server
npm install
npx prisma generate
npx prisma db push
node scripts/seed.js  # Populates DB with Admin, Librarian, Member & Books
```

### 2. Start Backend
```bash
# Inside /server directory
npm start
# Server runs on http://localhost:3000
```

### 3. Setup & Start Frontend
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

## 🧪 Demo Accounts (Pre-configured)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@library.com` | `password123` |
| **Librarian** | `biblio@library.com` | `password123` |
| **Member** | `student@school.com` | `password123` |

## 📝 Demo Scripts (Sprint Review)

### Scenario 1: Member Search & History (The "Student")
1. Login as `student@school.com`.
2. Browse the **Catalog**: Filter by "Science-fiction".
3. Check **My Books** to see current "Clean Code" borrowing (due in 14 days).

### Scenario 2: Librarian Management (The "Pro")
1. Login as `biblio@library.com`.
2. Go to **Borrowings** Dashboard.
3. See active loans.
4. **Action**: Create a new borrowing for a user.
5. **Action**: Return a book (mark as available).

### Scenario 3: Admin Overview
1. Login as `admin@library.com`.
2. View Global Status.
3. Manage users (future sprint).

## 🛠 Tech Stack
- **Backend:** Node.js, Express, Prisma ORM, SQLite
- **Frontend:** React, TailwindCSS, React Router, Vite
- **Security:** JWT Authentication, Bcrypt Password Hashing, Role-Based Access Control (RBAC)
