# Cloud Deployment Guide (Demo Mode / SQLite)

Since this is a **demonstration** project, we can deploy using **SQLite**.
**Note**: On platforms like Railway/Vercel, the filesystem is ephemeral. This means **all data will be wiped** when the server restarts or redeploys.

To handle this, we will configure the server to **re-create and re-seed** the database every time it starts.

## 1. Backend Deployment (Railway)

1.  Login to **Railway** and start a "New Project" -> "Deploy from GitHub repo".
2.  Select your repository.
3.  **Configure Service**:
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npx prisma db push && npm run seed && npm start`
    *   *Explanation: This command creates the `dev.db` file, populates it with test data (Admin/Books), and then starts the server.*

4.  **Environment Variables**:
    *   `PORT`: `3000` (or let Railway assign it)
    *   `JWT_SECRET`: `mysecretkey` (or any string)
    *   `DATABASE_URL`: `file:./dev.db` (Required by Prisma, even for SQLite)

5.  **Deploy**.
6.  Copy the **Public Domain** (e.g., `https://library-server.up.railway.app`).

---

## 2. Frontend Deployment (Vercel)

1.  Login to **Vercel** and "Add New Project".
2.  Import your repository.
3.  **Configure Project**:
    *   **Root Directory**: `client`
    *   **Framework Preset**: Vite
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`

4.  **Environment Variables**:
    *   `VITE_API_URL`: Paste the **Railway URL** from Step 1 (e.g., `https://library-server.up.railway.app`).
    *   *Note: Does not need a trailing slash.*

5.  **Deploy**.

## Summary
*   **Data Persistence**: None (Resets on deploy).
*   **Admin Account**: Always resets to `admin@library.com` / `password123`.
*   **Performance**: Fast and simple for demos.
