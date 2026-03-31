import db from '../database/db.js';

export const saveMessage = (sessionId, role, text) => {
  // Ensure session exists
  const session = db.prepare('SELECT id FROM sessions WHERE id = ?').get(sessionId);
  if (!session) {
    db.prepare('INSERT INTO sessions (id, title) VALUES (?, ?)').run(sessionId, text.substring(0, 30) + '...');
  } else {
    db.prepare('UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(sessionId);
  }

  // Insert message
  db.prepare('INSERT INTO messages (session_id, role, text) VALUES (?, ?, ?)').run(sessionId, role, text);
};

export const getSessionHistory = (sessionId) => {
  return db.prepare('SELECT role, text, timestamp FROM messages WHERE session_id = ? ORDER BY timestamp ASC').all(sessionId);
};

export const getAllSessions = () => {
  return db.prepare('SELECT * FROM sessions ORDER BY updated_at DESC').all();
};

export const deleteSession = (sessionId) => {
  db.prepare('DELETE FROM messages WHERE session_id = ?').run(sessionId);
  db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
};
export const deleteAllSessions = () => {
  db.prepare('DELETE FROM messages').run();
  db.prepare('DELETE FROM sessions').run();
};