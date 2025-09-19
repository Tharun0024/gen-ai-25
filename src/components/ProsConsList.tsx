import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ProsConsListProps {
  pros: string[];
  cons: string[];
}

const ProsConsList: React.FC<ProsConsListProps> = ({ pros, cons }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Analysis Summary</h3>
      
      {/* Pros */}
      {pros && pros.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-emerald-700 mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Favorable Terms
          </h4>
          <ul className="space-y-2">
            {pros.map((pro, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                {pro}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cons */}
      {cons && cons.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
            <XCircle className="w-4 h-4 mr-2" />
            Risk Factors
          </h4>
          <ul className="space-y-2">
            {cons.map((con, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                {con}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProsConsList;