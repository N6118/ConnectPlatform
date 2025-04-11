import React from 'react';
import { FaHourglassHalf, FaCheckCircle, FaFileAlt, FaBook } from 'react-icons/fa'; 

interface QuickProjectStatsProps {
  ongoingProjects: number;
  completedProjects: number;
  inworkPapers: number;
  publishedPapers: number;
}

const QuickProjectStats: React.FC<QuickProjectStatsProps> = ({ 
  ongoingProjects, 
  completedProjects,
  inworkPapers,
  publishedPapers 
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-700 tracking-wide">Overall Activity</h2>
      <div className="space-y-8">
        {/* Projects Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-600 mb-3">Projects</h3>
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2">
                <FaHourglassHalf className="text-blue-500" size={24} />
                <p className="text-3xl font-extrabold text-blue-600">{ongoingProjects}</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">Ongoing</p>
            </div>

            <div className="h-16 w-px bg-gray-200"></div>

            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-500" size={24} />
                <p className="text-3xl font-extrabold text-green-600">{completedProjects}</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        {/* Papers Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-600 mb-3">Papers</h3>
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2">
                <FaFileAlt className="text-orange-500" size={24} />
                <p className="text-3xl font-extrabold text-orange-600">{inworkPapers}</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">In Work</p>
            </div>

            <div className="h-16 w-px bg-gray-200"></div>

            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2">
                <FaBook className="text-purple-500" size={24} />
                <p className="text-3xl font-extrabold text-purple-600">{publishedPapers}</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">Published</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickProjectStats;
