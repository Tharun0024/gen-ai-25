import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe } from 'lucide-react';

const Security: React.FC = () => {
  const features = [
    {
      icon: Shield,
      text: "We do not store your files"
    },
    {
      icon: Lock,
      text: "End-to-end encrypted"
    },
    {
      icon: Globe,
      text: "Optional offline processing"
    }
  ];

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Privacy is Our Priority
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We've built security and privacy into every aspect of our platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900">{feature.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Security;