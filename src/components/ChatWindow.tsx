import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import type { Message } from './RightPanel';

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-4">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start space-x-3 ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.sender === 'user' 
                ? 'bg-indigo-500' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500'
            }`}>
              {message.sender === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            
            <div className={`max-w-[80%] ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}>
              <div className={`inline-block p-4 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-md'
                  : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md shadow-sm'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;