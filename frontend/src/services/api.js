import axios from 'axios';

const API_BASE_URL = '/api/chat';

export const sendMessageToBot = async (message, sessionId = null) => {
    try {
        const response = await axios.post(API_BASE_URL, { message, sessionId });
        return response.data;
    } catch (error) {
        console.error('Error talking to chatbot backend:', error);
        return {
            reply: "I'm having trouble connecting to my brain right now! Please try again later.",
            intent: "error"
        };
    }
};

export const fetchSessions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sessions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return [];
    }
};

export const fetchHistory = async (sessionId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/history/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
};
export const deleteSession = async (sessionId) => {
    try {
        await axios.delete(`${API_BASE_URL}/history/${sessionId}`);
        return true;
    } catch (error) {
        console.error('Error deleting session:', error);
        return false;
    }
};

export const clearAllHistory = async () => {
    try {
        await axios.delete(`${API_BASE_URL}/history/all`);
        return true;
    } catch (error) {
        console.error('Error clearing all history:', error);
        return false;
    }
};
