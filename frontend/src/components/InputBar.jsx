import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { motion } from 'framer-motion';
import '../styles/chat.css';

const InputBar = ({ onSendMessage, disabled, onNewChat }) => {
    const [inputText, setInputText] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (inputText.trim() && !disabled) {
            onSendMessage(inputText);
            setInputText('');
        }
    };

    return (
        <form className="input-bar" onSubmit={handleSend}>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button" 
                className="new-chat-btn-small"
                onClick={onNewChat}
                title="New Chat"
            >
                <AddIcon sx={{ fontSize: 20, mr: 0.5 }} />
                <span>New Chat</span>
            </motion.button>

            <input
                type="text"
                className="chat-input"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={disabled}
                autoFocus
            />
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="send-button"
                disabled={!inputText.trim() || disabled}
            >
                <SendIcon sx={{ fontSize: 20 }} />
            </motion.button>
        </form>
    );
};

export default InputBar;