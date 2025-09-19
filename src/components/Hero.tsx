import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Demystify Legal Documents
          </span>
          <br />
          <span className="text-gray-900">with AI</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Simplify contracts, agreements, and terms of service into plain English.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;