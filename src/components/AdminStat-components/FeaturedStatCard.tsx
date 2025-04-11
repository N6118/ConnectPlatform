import React from 'react';
import { motion } from "framer-motion";
import { MiniChart } from './MiniChart';

interface FeaturedStatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend?: number;
  color?: string;
  chartData: { name: string; value: number }[];
}

export const FeaturedStatCard: React.FC<FeaturedStatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  color = "blue",
  chartData
}) => {
  const colorMap: Record<string, { text: string, iconBg: string }> = {
    blue: { text: 'text-blue-600', iconBg: 'bg-blue-100' },
    green: { text: 'text-green-600', iconBg: 'bg-green-100' },
    purple: { text: 'text-purple-600', iconBg: 'bg-purple-100' },
    orange: { text: 'text-orange-600', iconBg: 'bg-orange-100' },
    yellow: { text: 'text-yellow-600', iconBg: 'bg-yellow-100' },
  };

  const colorStyle = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className={`p-2 ${colorStyle.iconBg} rounded-full`}>
                {icon}
              </div>
              <h3 className="font-medium text-gray-700">{title}</h3>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-4xl font-bold">{value}</p>
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
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </div>
      <MiniChart data={chartData} color={color} />
    </motion.div>
  );
};