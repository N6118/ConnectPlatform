import React from 'react';
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend?: number;
  color?: string;
  variant?: 'default' | 'gradient' | 'minimal';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  color = "blue",
  variant = 'default'
}) => {
  const colorMap: Record<string, { bg: string, text: string, iconBg: string, border: string, hover: string }> = {
    blue: { 
      bg: 'bg-blue-50', 
      text: 'text-blue-600', 
      iconBg: 'bg-blue-100', 
      border: 'border-blue-100',
      hover: 'hover:border-blue-200'
    },
    green: { 
      bg: 'bg-green-50', 
      text: 'text-green-600', 
      iconBg: 'bg-green-100', 
      border: 'border-green-100',
      hover: 'hover:border-green-200'
    },
    purple: { 
      bg: 'bg-purple-50', 
      text: 'text-purple-600', 
      iconBg: 'bg-purple-100', 
      border: 'border-purple-100',
      hover: 'hover:border-purple-200'
    },
    orange: { 
      bg: 'bg-orange-50', 
      text: 'text-orange-600', 
      iconBg: 'bg-orange-100', 
      border: 'border-orange-100',
      hover: 'hover:border-orange-200'
    },
    yellow: { 
      bg: 'bg-yellow-50', 
      text: 'text-yellow-600', 
      iconBg: 'bg-yellow-100', 
      border: 'border-yellow-100',
      hover: 'hover:border-yellow-200'
    },
  };

  const colorStyle = colorMap[color] || colorMap.blue;
  
  if (variant === 'gradient') {
    const gradientMap: Record<string, string> = {
      blue: 'from-blue-500 to-indigo-600',
      green: 'from-green-500 to-emerald-600',
      purple: 'from-purple-500 to-indigo-600',
      orange: 'from-orange-500 to-amber-600',
      yellow: 'from-yellow-500 to-amber-600',
    };
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${gradientMap[color]} text-white`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white/90">{title}</h3>
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
            {icon}
          </div>
        </div>
        <p className="text-3xl font-bold mt-4">{value}</p>
        <div className="flex items-center mt-2">
          <p className="text-sm text-white/80">{description}</p>
          {trend !== undefined && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`ml-2 text-sm ${trend > 0 ? 'text-green-200' : 'text-red-200'} font-medium`}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </motion.span>
          )}
        </div>
      </motion.div>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white rounded-xl shadow-sm border-b-4 border-t border-x border-gray-100"
        style={{ borderBottomColor: `var(--${color}-500)` }}
      >
        <div className="flex items-center justify-between">
          <div className={`p-2 ${colorStyle.iconBg} rounded-full`}>
            {icon}
          </div>
          {trend !== undefined && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </motion.span>
          )}
        </div>
        <p className="text-3xl font-bold mt-4">{value}</p>
        <h3 className="font-medium text-gray-600 mt-1">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 bg-white rounded-xl shadow-lg border ${colorStyle.border} ${colorStyle.hover} transition-all`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-600">{title}</h3>
        <div className={`p-2 ${colorStyle.iconBg} rounded-full`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold mt-4">{value}</p>
      <div className="flex items-center mt-2">
        <p className="text-sm text-gray-500">{description}</p>
        {trend !== undefined && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`ml-2 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}
          >
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};