import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskChartProps {
  score: number; // Score from 1 to 100
}

const RiskChart: React.FC<RiskChartProps> = ({ score = 0 }) => {
  const riskPercentage = Math.min(100, Math.max(0, Math.round(score)));

  const data = [
    { name: 'Risk', value: riskPercentage, color: '#EF4444' },
    { name: 'Safe', value: 100 - riskPercentage, color: '#10B981' }
  ];

  return (
    <div className="relative">
      <div className="w-40 h-40 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{riskPercentage}%</div>
            <div className="text-sm text-gray-600">Risk Level</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-700">High Risk</span>
          </div>
          <span className="font-semibold text-gray-900">{riskPercentage}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
            <span className="text-gray-700">Low Risk</span>
          </div>
          <span className="font-semibold text-gray-900">{100 - riskPercentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default RiskChart;