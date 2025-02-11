import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

const ProjectTracker = () => {
  const projects = [
    { name: 'AI Research', level: 'Medium', status: 'Completed', points: 3 },
    { name: 'Web Development', level: 'Difficult', status: 'In Progress', points: 5 },
    { name: 'Data Science', level: 'Easy', status: 'Not Started', points: 1 },
  ];

  const statusIcons = {
    Completed: <FaCheckCircle className="text-green-500" />,
    'In Progress': <FaSpinner className="text-yellow-500 animate-spin" />,
    'Not Started': <FaExclamationCircle className="text-red-500" />,
  };

  const statusColors = {
    Completed: 'bg-green-100',
    'In Progress': 'bg-yellow-100',
    'Not Started': 'bg-red-100',
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-800">Project Tracker</h2>
      <ul className="space-y-4">
        {projects.map((project, index) => (
          <motion.li
            key={index}
            className={`p-4 rounded-lg shadow-md flex items-center justify-between ${statusColors[project.status]}`}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {statusIcons[project.status]}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-700">{project.name}</p>
                <p className="text-sm text-gray-500">Level: {project.level}</p>
              </div>
            </div>

            <div className="text-right">
              <p className={`text-md font-semibold ${project.status === 'Completed' ? 'text-green-600' : project.status === 'In Progress' ? 'text-yellow-600' : 'text-red-600'}`}>
                {project.status}
              </p>
              <p className="text-sm text-gray-600">Points: {project.points}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectTracker;
