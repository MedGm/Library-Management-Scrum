# User Guide - Library Management System

## Roles & Access
*   **Member**: Can browse books, reserve items, and view own loans.
*   **Librarian**: Can manage books, issue loans, and process returns.
*   **Admin**: Full access including User Management, System Settings, and Audit Logs.

## Key Workflows

### 1. Borrowing a Book (Librarian)
1.  Navigate to **Manage Borrowings**.
2.  Click **"Borrow Book"** button.
3.  Select a **Book** (must be in stock) and a **Member**.
4.  Set the **Due Date** (default is based on rules).
5.  Confirm.

### 2. Returning a Book (Librarian)
1.  In **Manage Borrowings**, find the active loan.
2.  Click **"Return"**.
3.  Review any calculated **Penalties** (if late).
4.  Confirm return.

### 3. Managing Rules (Admin)
1.  Go to **Settings**.
2.  Adjust parameters:
    *   **Max Loans Per User**: Limit active borrowings.
    *   **Loan Duration**: Default days for a new loan.
    *   **Penalty Per Day**: Fee charged for late returns.
3.  Changes take effect immediately for new actions.

### 4. Audit Logs (Admin)
1.  Go to **Audit Logs**.
2.  View system-wide activities (Login, Borrow, Return, Rule Changes).
3.  Filter by Action Type or Date.
