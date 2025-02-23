import React from 'react';
import { motion } from "framer-motion";
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend?: number;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  color = "blue"
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-6 bg-white rounded-xl shadow-lg border border-${color}-100 hover:border-${color}-200 transition-all`}
  >
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-gray-600">{title}</h3>
      <div className={`p-2 bg-${color}-100 rounded-full`}>
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold mt-4">{value}</p>
    <div className="flex items-center mt-2">
      <p className="text-sm text-gray-500">{description}</p>
      {trend && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`ml-2 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}
        >
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </motion.span>
      )}
    </div>
  </motion.div>
);