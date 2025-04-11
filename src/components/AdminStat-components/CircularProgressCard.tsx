import React from 'react';
import { motion } from "framer-motion";

interface CircularProgressCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  trend?: number;
  color?: string;
  max?: number;
}

export const CircularProgressCard: React.FC<CircularProgressCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  color = "blue",
  max = 100
}) => {
  const colorMap: Record<string, { stroke: string, text: string, iconBg: string }> = {
    blue: { stroke: '#3b82f6', text: 'text-blue-600', iconBg: 'bg-blue-100' },
    green: { stroke: '#10b981', text: 'text-green-600', iconBg: 'bg-green-100' },
    purple: { stroke: '#8b5cf6', text: 'text-purple-600', iconBg: 'bg-purple-100' },
    orange: { stroke: '#f97316', text: 'text-orange-600', iconBg: 'bg-orange-100' },
    yellow: { stroke: '#eab308', text: 'text-yellow-600', iconBg: 'bg-yellow-100' },
  };

  const colorStyle = colorMap[color] || colorMap.blue;
  
  // Calculate percentage and SVG parameters
  const percentage = (value / max) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center"
    >
      <div className="relative flex items-center justify-center mb-4">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={colorStyle.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <div className={`p-2 ${colorStyle.iconBg} rounded-full mb-1`}>
            {icon}
          </div>
          <span className="text-2xl font-bold">{value}%</span>
        </div>
      </div>
      <h3 className="font-medium text-gray-700">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
      {trend !== undefined && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-2 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}
        >
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </motion.span>
      )}
    </motion.div>
  );
};