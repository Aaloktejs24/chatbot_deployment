import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="modal-content"
          >
            <h3>{title}</h3>
            <p>{message}</p>
            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={() => { onConfirm(); onClose(); }}>
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
