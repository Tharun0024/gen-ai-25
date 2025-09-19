import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import RiskChart from './RiskChart';
import ProsConsList from './ProsConsList';
import { useDocumentAnalysis } from './DocumentAnalysisContext';

const LeftPanel: React.FC = () => {
  const { analysis, isLoading } = useDocumentAnalysis();

  const riskScore = analysis?.risk_score ?? 0;
  const pros = analysis?.pros ?? [];
  const cons = analysis?.cons ?? [];

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 border-b border-gray-200"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <img 
              src="/wolf logo.png" 
              alt="LegalAI Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">LegalAI Assistant</h2>
            <p className="text-sm text-gray-600">Document Risk Analysis</p>
          </div>
        </div>
      </motion.div>

      {/* Risk Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="p-6 border-b border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
        {isLoading ? (
          <div className="text-center text-gray-500">Analyzing...</div>
        ) : (
          <RiskChart score={riskScore} />
        )}
      </motion.div>

      {/* Pros and Cons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex-1 p-6 overflow-y-auto"
      >
        {isLoading ? (
          <div className="text-center text-gray-500">Analyzing...</div>
        ) : (
          <ProsConsList pros={pros} cons={cons} />
        )}
      </motion.div>
    </div>
  );
};

export default LeftPanel;