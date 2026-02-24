# AI Learning Assistant

A PDF-powered AI learning platform built with the MERN stack + Google Gemini.

## Features

- 🔐 **Auth** — Register, Login, JWT-protected routes
- 📄 **PDF Upload & Viewer** — Upload PDFs, view inline with text extraction
- ✨ **AI Summary** — Generate AI-powered document summaries
- 💬 **AI Chat** — Ask questions about your documents
- 🃏 **Flashcards** — AI-generated flashcards with flip animation & progress tracking
- 📝 **Quizzes** — Generate quizzes, attempt, get scored results with explanations
- 📊 **Dashboard** — Stats overview with recent activity
- 👤 **Profile** — View account info, change password
- 🌙 **Dark/Light Mode** — Toggle with localStorage persistence

## Tech Stack

| Frontend | Backend |
|----------|---------|
| React (Vite) | Node.js / Express |
| Tailwind CSS v4 | MongoDB Atlas / Mongoose |
| React Router | JWT Authentication |
| Axios | Multer (PDF upload) |
| Context API | pdf-parse |
| react-hot-toast | Google Gemini API |

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Gemini API key
npm install
node server.js
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

### 3. Environment Variables

Edit `server/.env`:

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ai_learning
JWT_SECRET=your_secret_here
GEMINI_API_KEY=your_gemini_key_here
```

## Project Structure

```
ai-learning-assistant/
├── server/
│   ├── controllers/     # Route handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── middleware/       # Auth, error handler, multer
│   ├── services/        # Gemini AI service
│   └── server.js        # Entry point
├── client/
│   └── src/
│       ├── components/  # Layout, auth components
│       ├── context/     # Auth, Theme contexts
│       ├── pages/       # All page components
│       ├── services/    # Axios API service
│       └── App.jsx      # Router + Providers
└── README.md
```
