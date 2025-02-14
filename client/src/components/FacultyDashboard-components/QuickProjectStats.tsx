import React from 'react';
import { FaHourglassHalf, FaCheckCircle } from 'react-icons/fa'; 

interface QuickProjectStatsProps {
  ongoing: number;
  completed: number;
}

const QuickProjectStats: React.FC<QuickProjectStatsProps> = ({ ongoing, completed }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-700 tracking-wide">Project Stats</h2>
      <div className="flex justify-around items-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <FaHourglassHalf className="text-blue-500" size={30} />
            <p className="text-4xl font-extrabold text-blue-600">{ongoing}</p>
          </div>
          <p className="mt-2 text-gray-600">Ongoing Projects</p>
        </div>

        <div className="h-16 w-px bg-gray-200"></div>

        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <FaCheckCircle className="text-green-500" size={30} />
            <p className="text-4xl font-extrabold text-green-600">{completed}</p>
          </div>
          <p className="mt-2 text-gray-600">Completed Projects</p>
        </div>
      </div>
    </div>
  );
};

export default QuickProjectStats;
