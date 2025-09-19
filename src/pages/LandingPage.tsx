import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import About from '../components/About';
import Security from '../components/Security';
import Benefits from '../components/Benefits';
import FloatingContinueButton from '../components/FloatingContinueButton';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Hero />
      <About />
      <Security />
      <Benefits />
      <FloatingContinueButton />
    </div>
  );
};

export default LandingPage;