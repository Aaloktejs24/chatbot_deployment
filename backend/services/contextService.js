// In-memory store for session contexts
const sessions = {};

export const getContext = (sessionId) => {
    return sessions[sessionId] || { lastIntent: null, history: [] };
};

export const updateContext = (sessionId, intent, message) => {
    if (!sessions[sessionId]) {
        sessions[sessionId] = { lastIntent: null, history: [] };
    }
    sessions[sessionId].lastIntent = intent;
    sessions[sessionId].history.push({ role: 'user', message });
    
    // Keep history small to preserve memory
    if (sessions[sessionId].history.length > 20) {
        sessions[sessionId].history.shift();
    }
};

export const clearContext = (sessionId) => {
    if (sessions[sessionId]) {
        delete sessions[sessionId];
    }
}
