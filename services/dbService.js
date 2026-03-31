import db from '../database/db.js';

export const saveMessage = async (sessionId, role, text) => {
  // Ensure session exists
  const sessionRes = await db.execute({
    sql: 'SELECT id FROM sessions WHERE id = ?',
    args: [sessionId]
  });
  
  if (sessionRes.rows.length === 0) {
    await db.execute({
      sql: 'INSERT INTO sessions (id, title) VALUES (?, ?)',
      args: [sessionId, text.substring(0, 30) + '...']
    });
  } else {
    await db.execute({
      sql: 'UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [sessionId]
    });
  }

  // Insert message
  await db.execute({
    sql: 'INSERT INTO messages (session_id, role, text) VALUES (?, ?, ?)',
    args: [sessionId, role, text]
  });
};

export const getSessionHistory = async (sessionId) => {
  const res = await db.execute({
    sql: 'SELECT role, text, timestamp FROM messages WHERE session_id = ? ORDER BY timestamp ASC',
    args: [sessionId]
  });
  return res.rows;
};

export const getAllSessions = async () => {
  const res = await db.execute('SELECT * FROM sessions ORDER BY updated_at DESC');
  return res.rows;
};

export const deleteSession = async (sessionId) => {
  await db.execute({
    sql: 'DELETE FROM messages WHERE session_id = ?',
    args: [sessionId]
  });
  await db.execute({
    sql: 'DELETE FROM sessions WHERE id = ?',
    args: [sessionId]
  });
};

export const deleteAllSessions = async () => {
  await db.execute('DELETE FROM messages');
  await db.execute('DELETE FROM sessions');
};