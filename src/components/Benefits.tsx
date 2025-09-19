import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, MessageCircle, Clock } from 'lucide-react';

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: FileText,
      title: "Easy Summaries",
      description: "Get clear, concise summaries of complex legal documents"
    },
    {
      icon: AlertTriangle,
      title: "Risk Insights",
      description: "Identify potential risks and important clauses automatically"
    },
    {
      icon: MessageCircle,
      title: "Chatbot Q&A",
      description: "Ask questions about your document and get instant answers"
    },
    {
      icon: Clock,
      title: "Save Time & Money",
      description: "Reduce legal review time and avoid expensive consultation fees"
    }
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the power of AI-driven legal document analysis with these key benefits.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;