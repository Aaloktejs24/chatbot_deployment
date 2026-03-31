import express from 'express';
import { handleChatMessage, getHistory, getSessions, deleteSession, clearAllHistory } from '../controllers/chatController.js';

const router = express.Router();

// Define chat routes
router.post('/', handleChatMessage);
router.get('/sessions', getSessions);
router.get('/history/:sessionId', getHistory);
router.delete('/history/all', clearAllHistory);
router.delete('/history/:sessionId', deleteSession);

export default router;
