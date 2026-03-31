import React, { useState, useEffect } from 'react';
import { fetchSessions, deleteSession, clearAllHistory } from '../services/api';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import IconButton from '@mui/material/IconButton';
import ConfirmModal from './ConfirmModal';
import './Sidebar.css';

const Sidebar = ({ onSelectSession, activeSessionId, sessionVersion, isOpen, onToggle }) => {
    const [sessions, setSessions] = useState([]);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const loadSessions = async () => {
        const data = await fetchSessions();
        setSessions(data);
    };

    useEffect(() => {
        loadSessions();
    }, [activeSessionId, sessionVersion]);

    const handleDeleteSession = (e, sessionId) => {
        e.stopPropagation();
        setModalConfig({
            isOpen: true,
            title: 'Delete Chat',
            message: 'Are you sure you want to delete this chat history?',
            onConfirm: async () => {
                const success = await deleteSession(sessionId);
                if (success) loadSessions();
            }
        });
    };

    const handleClearAll = () => {
        setModalConfig({
            isOpen: true,
            title: 'Clear All History',
            message: 'This will permanently delete ALL your chat history. This action cannot be undone.',
            onConfirm: async () => {
                const success = await clearAllHistory();
                if (success) loadSessions();
            }
        });
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    {window.innerWidth <= 900 && (
                        <IconButton 
                            onClick={onToggle}
                            sx={{ color: 'var(--text-primary)', mr: 1 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
                    <h2>Chat History</h2>
                    <IconButton 
                        size="small" 
                        onClick={handleClearAll} 
                        title="Clear All"
                        sx={{ color: 'var(--primary)', ml: 'auto' }}
                    >
                        <DeleteSweepIcon fontSize="small" />
                    </IconButton>
                </div>
                <div className="sessions-list">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
                            onClick={() => {
                                onSelectSession(session.id);
                                if (window.innerWidth <= 900) setIsOpen(false);
                            }}
                        >
                            <div className="session-info">
                                <span className="session-title">{session.title}</span>
                                <span className="session-date">
                                    {new Date(session.updated_at).toLocaleDateString()}
                                </span>
                            </div>
                            <IconButton 
                                size="small" 
                                onClick={(e) => handleDeleteSession(e, session.id)}
                                className="delete-session-btn"
                                sx={{ opacity: 0, transition: 'opacity 0.2s', color: 'var(--text-secondary)' }}
                            >
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                    ))}
                </div>
            </div>
            <ConfirmModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
            />
        </>
    );
};

export default Sidebar;
