import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }, [message, onSendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-4">
      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about your document..."
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>
      
      <motion.button
        type="submit"
        disabled={!message.trim()}
        className={`p-4 rounded-xl transition-all duration-200 flex items-center justify-center ${
          message.trim()
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        whileHover={message.trim() ? { scale: 1.05 } : {}}
        whileTap={message.trim() ? { scale: 0.95 } : {}}
      >
        <Send className="w-5 h-5" />
      </motion.button>
    </form>
  );
};

export default ChatInput;