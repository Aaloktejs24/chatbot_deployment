#  Enlight AI Chatbot - Premium Monochrome Edition

A sophisticated, context-aware conversational agent built as a full-stack integrated application.

---

##  Setup & Execution (Local)

1. Make sure you have Node.js installed.
2. Run the startup script:
```bash
./start.sh
```
- **App**: Accessible at `http://localhost:5001`

---

## Architecture Explanation

The project is a **Full-Stack Integrated App**:
1. **Unified Server**: Node.js/Express serves both the API and the React frontend (static files from `frontend/dist`).
2. **Database**: Turso (Cloud SQLite) or local SQLite.
3. **Deployment**: Simplified to a single web service.

---

##  Deploying to Render

To keep your chat history persistent on Render's free tier, we use **Turso**.

### 1. Setup Turso Database
1. Go to [Turso.tech](https://turso.tech/) and create a free account.
2. Create a new database (e.g., `chatbot-db`).
3. Get your **Database URL** (`libsql://...`) and **Auth Token**.

### 2. Render Deployment (Single Web Service)
- **Repo**: Connect your GitHub repository.
- **Root Directory**: `(leave empty)`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `PORT`: `5001`
  - `TURSO_DATABASE_URL`: Your Turso DB URL
  - `TURSO_AUTH_TOKEN`: Your Turso Auth Token

---

## Features
- **Contextual Multi-Turn Logic**: Remembers the previous topic.
- **Humanized Tone**: Warm and affectionate bot replies.
- **Safety Content Filtering**: Integrated protection.
- **Source Attribution**: Knowledge base citations.
- **Persistence**: Turso Cloud SQLite.
- **Mobile Responsive**: Premium monochrome UI.
