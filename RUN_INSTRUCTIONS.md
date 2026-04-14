# Imposter Word Game - Setup & Run Instructions

This comprehensive guide explains how to run the fullstack Imposter Word Game locally, and details the setup for deploying to Vercel.

## 🛠 Prerequisites

Make sure you have installed on your system:
- **Node.js** (v18 or higher)
- **npm** (Node Package Manager)

## 💻 Local Development Setup

Because this is a fullstack application, you need to run both the Frontend client and the Backend server.

### 1. Setup Backend (Server)

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Establish your environment variables. Create a `.env` file in the `server` directory with the following keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Optional: If omitted, the game uses an in-memory local database.
   # MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on port 3001.*

### 2. Setup Frontend (Client)

1. Open a **new** separate terminal and navigate to the root directory of the project.
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on http://localhost:5173.*

Once both are running, open your web browser and go to `http://localhost:5173` to play!

---

## 🚀 Deployment

You do **not** need separate repositories. You can deploy both the frontend and backend from this single repository using a platform like **Render**, which supports Monorepo architectures.

### Why Render?
This project relies heavily on WebSockets (`socket.io`) for real-time multiplayer functionality. Traditional serverless platforms (like Vercel) **do not** support persistent WebSocket connections. Render provides long-running Node.js servers, making it perfect for the backend.

### Deploying the Backend on Render
1. Go to [Render](https://render.com/) and create a **New Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build` (Ensure you configure a build target if using TypeScript in production, or just use `npm install` if running via ts-node directly).
   - **Start Command**: `npm start`
4. **Environment Variables**: Add your `GEMINI_API_KEY` and `MONGODB_URI`.
5. Deploy the backend! It will give you a live URL (e.g., `https://imposter-server.onrender.com`).

### Deploying the Frontend on Render
1. Create a **New Static Site** in Render.
2. Connect the **same** GitHub repository.
3. Configure the site:
   - **Root Directory**: `.` (leave generic/blank, pointing to the root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Important Variables**: Ensure the frontend code is pointed to the backend's live URL (i.e. configuring your Socket.IO client or `VITE_BACKEND_URL`).
5. Deploy the frontend!

You will now have both your Static Frontend and your Node.js Backend running securely from one single repository.
