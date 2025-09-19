import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FloatingContinueButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      <motion.button
        onClick={() => navigate('/chat')}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl flex items-center space-x-3 relative overflow-hidden group"
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.5)',
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            background: [
              'linear-gradient(45deg, #7C3AED, #4F46E5)',
              'linear-gradient(45deg, #4F46E5, #7C3AED)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        />
        
        <span className="relative z-10">Try It Now</span>
        <motion.div
          className="relative z-10"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default FloatingContinueButton;