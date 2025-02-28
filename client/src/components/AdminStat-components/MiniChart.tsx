import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

interface MiniChartProps {
  data: { name: string; value: number }[];
  color: string;
}

export const MiniChart: React.FC<MiniChartProps> = ({ data, color }) => {
  const colorMap: Record<string, string> = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    orange: '#f97316',
    yellow: '#eab308',
  };

  const chartColor = colorMap[color] || colorMap.blue;

  return (
    <div className="h-16">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`colorGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none', 
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              fontSize: '0.75rem',
              padding: '0.5rem'
            }}
            formatter={(value) => [`${value}`, '']}
            labelFormatter={() => ''}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={chartColor} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#colorGradient-${color})`} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};