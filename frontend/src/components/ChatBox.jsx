import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import { sendMessageToBot, fetchHistory } from '../services/api';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import '../styles/chat.css';

const ChatBox = ({ sessionId, onNewChat, onMessageSent, onToggleSidebar }) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadHistory = async () => {
        setIsLoading(true);
        const history = await fetchHistory(sessionId);
        if (history && history.length > 0) {
            setMessages(history.map((msg, i) => ({
                id: i,
                text: msg.text,
                isBot: msg.role === 'bot'
            })));
        } else {
            setMessages([
                { id: 1, text: "Hi there! I'm your AI assistant. How can I help you today?", isBot: true }
            ]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadHistory();
    }, [sessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text) => {
        const newUserMsg = { id: Date.now(), text, isBot: false };
        setMessages(prev => [...prev, newUserMsg]);
        setIsLoading(true);

        const response = await sendMessageToBot(text, sessionId);
        
        setIsLoading(false);
        const newBotMsg = { 
            id: Date.now() + 1, 
            text: response.reply || "Something went wrong.", 
            isBot: true 
        };
        setMessages(prev => [...prev, newBotMsg]);
        if (onMessageSent) onMessageSent();
    };

    return (
        <div className="chatbox-container">
            <div className="chatbox-header">
                {window.innerWidth <= 900 && (
                    <IconButton 
                        onClick={onToggleSidebar}
                        sx={{ color: 'var(--text-primary)', mr: 1, ml: -1 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <h2>Enlight AI</h2>
            </div>
            
            <div className="chatbox-messages">
                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} isBot={msg.isBot} />
                ))}
                
                {isLoading && (
                    <div className="typing-indicator">
                        <div className="dot-typing"></div>
                        <div className="dot-typing"></div>
                        <div className="dot-typing"></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <InputBar 
                onSendMessage={handleSendMessage} 
                disabled={isLoading} 
                onNewChat={onNewChat}
            />
        </div>
    );
};

export default ChatBox;
