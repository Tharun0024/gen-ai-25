import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface AnalysisData {
  extracted_text: string;
  summary: string;
  risks_and_score: string;
  pros_cons: string;
}

interface DocumentAnalysisContextType {
  analysis: AnalysisData | null;
  setAnalysis: (data: AnalysisData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DocumentAnalysisContext = createContext<DocumentAnalysisContextType | undefined>(undefined);

export const DocumentAnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DocumentAnalysisContext.Provider value={{ analysis, setAnalysis, isLoading, setIsLoading }}>
      {children}
    </DocumentAnalysisContext.Provider>
  );
};

export const useDocumentAnalysis = () => {
  const context = useContext(DocumentAnalysisContext);
  if (context === undefined) {
    throw new Error('useDocumentAnalysis must be used within a DocumentAnalysisProvider');
  }
  return context;
};