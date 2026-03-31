import React from 'react';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import '../styles/chat.css';

const MessageBubble = ({ message, isBot }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`message-wrapper ${isBot ? 'bot-wrapper' : 'user-wrapper'}`}
        >
            <div className={`message-bubble ${isBot ? 'bot-message' : 'user-message'}`}>
                {isBot && (
                    <div className="avatar bot-avatar">
                        <SmartToyIcon sx={{ fontSize: 20 }} />
                    </div>
                )}
                
                <div className="message-content">
                    {message.text}
                </div>

                {!isBot && (
                    <div className="avatar user-avatar">
                        <PersonIcon sx={{ fontSize: 20 }} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MessageBubble;
