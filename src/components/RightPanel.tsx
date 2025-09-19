import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from './FileUpload';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import { useDocumentAnalysis } from './DocumentAnalysisContext';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const RightPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your legal document assistant. Upload a document to get started, or ask me any questions about legal documents.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const { analysis, setAnalysis, setIsLoading } = useDocumentAnalysis();
  const hasDocument = !!analysis?.extracted_text;

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    if (!hasDocument || !analysis?.extracted_text) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'd be happy to help! Please upload a document first so I can provide specific insights about it.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('user_question', text);
      formData.append('doc_text', analysis.extracted_text);

      const response = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      const data = await response.json();
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error asking question:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error while answering your question. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setAnalysis(null);
    const uploadMessage: Message = {
      id: Date.now().toString(),
      text: `Analyzing "${file.name}"...`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, uploadMessage]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      const data = await response.json();
      setAnalysis(data);
      setIsLoading(false);

      const summaryMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.summary || `Finished analyzing "${file.name}". You can now ask questions about it.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, summaryMessage]);
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsLoading(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error analyzing your document. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* File Upload Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 bg-white border-b border-gray-200"
      >
        <FileUpload onFileUpload={handleFileUpload} />
      </motion.div>

      {/* Chat Window */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow messages={messages} />
      </div>

      {/* Chat Input */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="p-6 bg-white border-t border-gray-200"
      >
        <ChatInput onSendMessage={handleSendMessage} />
      </motion.div>
    </div>
  );
};

export default RightPanel;