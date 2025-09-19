import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChatbotPage from './pages/ChatbotPage';
import { DocumentAnalysisProvider } from './components/DocumentAnalysisContext';

function App() {
  return (
    <DocumentAnalysisProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatbotPage />} />
          </Routes>
        </div>
      </Router>
    </DocumentAnalysisProvider>
  );
}

export default App;