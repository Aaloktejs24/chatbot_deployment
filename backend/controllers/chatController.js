import { getChatResponse } from '../services/responseService.js';
import { filterMessage } from '../services/filterService.js';
import { determineIntent } from '../services/intentService.js';
import { getContext, updateContext } from '../services/contextService.js';
import { saveMessage, getSessionHistory, getAllSessions, deleteSession as deleteSessionDb, deleteAllSessions } from '../services/dbService.js';

export const handleChatMessage = async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const sid = sessionId || `session_${Date.now()}`;
        
        // Save user message
        saveMessage(sid, 'user', message);

        // 1. Filter Check (NSFW/inappropriate)
        const filterResult = filterMessage(message);
        if (filterResult.isFlagged) {
            saveMessage(sid, 'bot', filterResult.reply);
            updateContext(sid, 'refusal', message);
            return res.json({
                sessionId: sid,
                reply: filterResult.reply
            });
        }

        // 2. Intent determined
        const context = getContext(sid);
        const intentResult = determineIntent(message, context);

        // 3. Response Generation
        const responseObj = getChatResponse(intentResult, message, context);
        const responseText = responseObj.text;
        const finalIntent = responseObj.intent;
        
        // Save bot response
        saveMessage(sid, 'bot', responseText);

        // 4. Update Context
        updateContext(sid, finalIntent, message);

        return res.json({
            sessionId: sid,
            reply: responseText,
            intent: finalIntent
        });
    } catch (error) {
        console.error('Error handling chat message:', error);
        res.status(500).json({ error: 'Internal server error while processing message' });
    }
};

export const getHistory = async (req, res) => {
    const { sessionId } = req.params;
    const history = getSessionHistory(sessionId);
    res.json(history);
};

export const getSessions = async (req, res) => {
    const sessions = getAllSessions();
    res.json(sessions);
};
export const deleteSession = async (req, res) => {
    const { sessionId } = req.params;
    deleteSessionDb(sessionId);
    res.json({ message: 'Session deleted' });
};

export const clearAllHistory = async (req, res) => {
    deleteAllSessions();
    res.json({ message: 'All history cleared' });
};