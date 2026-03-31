#  Enlight AI Chatbot - Premium Monochrome Edition

A sophisticated, context-aware conversational agent built as a full-stack app. This bot combines a premium monochrome design system with a robust, locally-run NLP matching engine.

---

##  Setup & Execution

The easiest way to run the entire project is using **Docker**.

### 1. Requirements
- Docker and Docker Compose installed.

### 2. Launching the App
The easy way (Auto-install + Start):
```bash
./start.sh
```

The manual way:
```bash
docker-compose up --build -d
```
- **Frontend**: Accessible at `http://localhost:3000`
- **Backend API**: Accessible at `http://localhost:5001`

### 3. Stopping the App
```bash
./stop.sh
```

### 4. Running Automated Tests
To verify the engine's integrity (Intent detection & Filters), run:
```bash
docker-compose exec backend npm test
```

---

## Features
- **Contextual Multi-Turn Logic**: Remembers the previous topic for follow-up questions (e.g., "Tell me a joke" -> "One more?").
- **Humanized Tone**: Bot replies with genuine warmth and affection.
- **Safety Content Filtering**: Integrated `filterService.js` to handle inappropriate messages politely.
- **Source Attribution**: Answers from the knowledge base include source citations.
- **Persistence**: Chat history is stored locally using SQLite for seamless recovery on refresh.
- **Mobile Responsive**: Features a smooth drawer-style sidebar for small screens.

---

## Architecture Explanation

The system is split into a **Frontend (React)** and **Backend (Node.js/Express)**:

1.  **Intent Engine**: Uses token-overlap scoring to match user input against `intents.json` and `knowledge.json`. It prioritizes exact matches but falls back to fuzzy subsets.
2.  **Context Synchronization**: A `lastIntent` state is maintained per session, allowing the bot to determine if user responses like "Yes" or "Why?" are part of an ongoing multi-turn loop.
3.  **Data Storage**: SQLite (via `better-sqlite3`) ensures all messages and session titles are persisted persistently in the `./backend/data/` volume.
4.  **Reverse Proxy**: Nginx handles the static frontend serving and API proxying to port 5001.

---

## File Structure

```
aaloktejas@Aaloks-MacBook-Air chatbot-project % tree
.
├── README.md
├── backend
│   ├── Dockerfile
│   ├── controllers
│   │   └── chatController.js
│   ├── data
│   │   ├── chatbot.db
│   │   ├── intents.json
│   │   ├── knowledge.json
│   │   └── responses.json
│   ├── database
│   │   └── db.js
│   ├── node_modules
│   │   ├── @babel
│   │   ├── @bcoe
│   │   ├── @isaacs
│   │   ├── @istanbuljs
│   │   ├── @jest
│   │   ├── @jridgewell
│   │   ├── @pkgjs
│   │   ├── @pkgr
│   │   ├── @sinclair
│   │   ├── @sinonjs
│   │   ├── @types
│   │   ├── @ungap
│   │   └── @unrs
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   └── chatRoutes.js
│   ├── server.js
│   ├── services
│   │   ├── contextService.js
│   │   ├── dbService.js
│   │   ├── filterService.js
│   │   ├── intentService.js
│   │   └── responseService.js
│   └── tests
│       ├── filterService.test.js
│       └── intentService.test.js
├── docker-compose.yml
└── frontend
    ├── Dockerfile
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── nginx.conf
    ├── package-lock.json
    ├── package.json
    ├── public
    │   └── icons.svg
    ├── src
    │   ├── App.css
    │   ├── App.jsx
    │   ├── assets
    │   │   ├── hero.png
    │   │   ├── react.svg
    │   │   └── vite.svg
    │   ├── components
    │   │   ├── ChatBox.jsx
    │   │   ├── ConfirmModal.css
    │   │   ├── ConfirmModal.jsx
    │   │   ├── InputBar.jsx
    │   │   ├── MessageBubble.jsx
    │   │   ├── Sidebar.css
    │   │   └── Sidebar.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── services
    │   │   └── api.js
    │   └── styles
    │       └── chat.css
    └── vite.config.js

29 directories, 45 files
aaloktejas@Aaloks-MacBook-Air chatbot-project % 
```


## Assumptions & Tactical Decisions
- **Rule-Based over LLM**: As per the "no massive cloud APIs" goal, I assumed a local-first, rule-based approach using `natural` (NLP library) and custom scoring is preferred for speed and privacy.
- **Stateless API, Stateful Database**: The API is designed to be stateless, with session context retrieved from and synced to the database on every request to ensure reliability.

---

## Limitations
- **Fuzzy Matching Depth**: Being rule-based, the bot might fail on very complex linguistic metaphors that a large LLM would understand.
- **Knowledge Base Size**: Currently relies on a static JSON file; scaling to millions of entries would require a Vector Database (like Pinecone) or Meilisearch.

---

##  Future Improvements
- **Hybrid RAG**: Integrate a local small LLM (like Llama-3-8B via Ollama) to handle fallback queries more naturally.
- **Real-time Analytics**: Add a dashboard for the Admin to see top keywords and fallback rates.
- **Voice Typing**: Integrate Web Speech API for hands-free interaction.
- **Enhanced Formatting**: Support for Markdown and code snippets in the bot's responses.
