import React, { useState } from "react";
import { motion } from "framer-motion";
import { StatCard } from './StatCard';
import { FeaturedStatCard } from './FeaturedStatCard';
import { CircularProgressCard } from './CircularProgressCard';
import { Users, Target, BookMarked, UserCheck, Building, Briefcase, GraduationCap, School, Calendar } from "lucide-react";
import { useLocation } from "wouter";

// Generate some sample chart data
const generateChartData = (points: number, min: number, max: number, trend: number) => {
  const data = [];
  let lastValue = Math.floor(Math.random() * (max - min) + min);
  
  for (let i = 0; i < points; i++) {
    // Use the trend to influence the direction of change
    const change = Math.random() * 10 - (trend > 0 ? 3 : 7);
    lastValue = Math.max(min, Math.min(max, lastValue + change));
    data.push({ name: `Point ${i}`, value: Math.floor(lastValue) });
  }
  
  return data;
};

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const StatsGrid = () => {
  const [showFacultyOnly, setShowFacultyOnly] = useState(false);
  const [_, setLocation] = useLocation();
  
  // User breakdown data
  const userStats = {
    title: "Total Users",
    value: "1,234",
    icon: <Users className="w-5 h-5 text-blue-600" />,
    description: "Active users across all roles",
    trend: 12,
    color: "blue",
    chartData: generateChartData(12, 800, 1300, 12),
    breakdown: [
      { label: "Faculty", value: 245, percentage: 20 },
      { label: "Students", value: 978, percentage: 79 },
      { label: "Admin", value: 11, percentage: 1 }
    ]
  };
  
  // Research data
  const researchStats = {
    title: "Research",
    value: "245",
    icon: <Target className="w-5 h-5 text-purple-600" />,
    description: "Research activities and publications",
    trend: 15,
    color: "purple",
    chartData: generateChartData(12, 200, 300, 15),
    breakdown: {
      ongoing: 156,
      published: 89
    }
  };
  
  // Projects data
  const projectsStats = {
    title: "Projects",
    value: showFacultyOnly ? "87" : "213",
    icon: <Briefcase className="w-5 h-5 text-green-600" />,
    description: showFacultyOnly ? "Faculty-led projects" : "All active projects",
    trend: showFacultyOnly ? 8 : 12,
    color: "green",
    chartData: generateChartData(12, showFacultyOnly ? 70 : 180, showFacultyOnly ? 100 : 230, showFacultyOnly ? 8 : 12),
    breakdown: {
      faculty: 87,
      student: 126
    }
  };
  
  // Clubs data
  const clubsStats = {
    title: "Active Clubs",
    value: "28",
    icon: <Building className="w-5 h-5 text-yellow-600" />,
    description: "Student organizations",
    trend: 10,
    color: "yellow",
    chartData: generateChartData(12, 20, 35, 10)
  };

  // Events data
  const eventsStats = {
    title: "Events",
    value: "12",
    icon: <Calendar className="w-5 h-5 text-orange-600" />,
    description: "Upcoming academic events",
    trend: 8,
    color: "orange",
    chartData: generateChartData(12, 8, 15, 8)
  };

  const handleCardClick = (path: string) => {
    setLocation(path);
  };

  return (
    <div className=" bg-gray-50 rounded-xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        {/* Featured card for Total Users with breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-2 cursor-pointer"
          onClick={() => handleCardClick("/admin/users")}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    {userStats.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">{userStats.title}</h3>
                    <p className="text-sm text-gray-500">{userStats.description}</p>
                  </div>
                </div>
                {userStats.trend !== undefined && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`px-3 py-1 rounded-full ${userStats.trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} font-medium text-sm flex items-center gap-1`}
                  >
                    {userStats.trend > 0 ? '↑' : '↓'} {Math.abs(userStats.trend)}%
                    <span className="text-xs text-gray-500">vs last month</span>
                  </motion.div>
                )}
              </div>
              
              <p className="text-4xl font-bold mb-6">{userStats.value}</p>
              
              <div className="grid grid-cols-3 gap-6">
                {userStats.breakdown.map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {item.label === "Faculty" && <UserCheck className="w-4 h-4 text-blue-600" />}
                        {item.label === "Students" && <GraduationCap className="w-4 h-4 text-blue-600" />}
                        {item.label === "Admin" && <School className="w-4 h-4 text-blue-600" />}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <p className="text-2xl font-bold mb-2">{item.value}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.percentage}% of total</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Research with ongoing and published stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="cursor-pointer"
          onClick={() => handleCardClick("/admin/publications")}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-purple-100 hover:border-purple-200 transition-all p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-600">{researchStats.title}</h3>
              <div className="p-2 bg-purple-100 rounded-full">
                {researchStats.icon}
              </div>
            </div>
            <p className="text-3xl font-bold mt-4">{researchStats.value}</p>
            <div className="flex items-center mt-2">
              <p className="text-sm text-gray-500">{researchStats.description}</p>
              {researchStats.trend !== undefined && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`ml-2 text-sm ${researchStats.trend > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}
                >
                  {researchStats.trend > 0 ? '↑' : '↓'} {Math.abs(researchStats.trend)}%
                </motion.span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center">
                  <Target className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Ongoing</span>
                </div>
                <p className="text-xl font-bold mt-1">{researchStats.breakdown.ongoing}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center">
                  <BookMarked className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Published</span>
                </div>
                <p className="text-xl font-bold mt-1">{researchStats.breakdown.published}</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Projects with faculty/student toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 cursor-pointer"
          onClick={() => handleCardClick("/admin/projects")}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-green-100 hover:border-green-200 transition-all p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="font-medium text-gray-600 mr-3">{projectsStats.title}</h3>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="toggle" 
                    id="faculty-toggle" 
                    checked={showFacultyOnly}
                    onChange={() => setShowFacultyOnly(!showFacultyOnly)}
                    className="sr-only peer"
                  />
                  <label 
                    htmlFor="faculty-toggle" 
                    className="block overflow-hidden h-5 rounded-full bg-gray-200 cursor-pointer peer-checked:bg-green-500"
                  >
                    <span className="absolute left-0 block w-5 h-5 rounded-full bg-white border-2 border-gray-200 transform transition-transform duration-200 translate-x-0 peer-checked:translate-x-5"></span>
                  </label>
                </div>
                <span className="text-xs text-gray-500">Faculty only</span>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                {projectsStats.icon}
              </div>
            </div>
            <p className="text-3xl font-bold mt-4">{projectsStats.value}</p>
            <div className="flex items-center mt-2">
              <p className="text-sm text-gray-500">{projectsStats.description}</p>
              {projectsStats.trend !== undefined && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`ml-2 text-sm ${projectsStats.trend > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}
                >
                  {projectsStats.trend > 0 ? '↑' : '↓'} {Math.abs(projectsStats.trend)}%
                </motion.span>
              )}
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <UserCheck className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Faculty Projects</span>
                </div>
                <span className="text-sm font-bold">{projectsStats.breakdown.faculty}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-green-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(projectsStats.breakdown.faculty / (projectsStats.breakdown.faculty + projectsStats.breakdown.student)) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              
              {!showFacultyOnly && (
                <>
                  <div className="flex items-center justify-between mb-1 mt-3">
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Student Projects</span>
                    </div>
                    <span className="text-sm font-bold">{projectsStats.breakdown.student}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className="bg-green-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(projectsStats.breakdown.student / (projectsStats.breakdown.faculty + projectsStats.breakdown.student)) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Simplified Clubs card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="cursor-pointer"
          onClick={() => handleCardClick("/admin/clubs")}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-yellow-100 hover:border-yellow-200 transition-all p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-xl">
                  {clubsStats.icon}
                </div>
                <h3 className="font-medium text-gray-700">{clubsStats.title}</h3>
              </div>
            </div>
            <p className="text-4xl font-bold">{clubsStats.value}</p>
            <p className="text-sm text-gray-500 mt-2">{clubsStats.description}</p>
            {clubsStats.trend !== undefined && (
              <div className={`inline-flex items-center gap-1 px-2 py-1 mt-3 rounded-full text-sm ${clubsStats.trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {clubsStats.trend > 0 ? '↑' : '↓'} {Math.abs(clubsStats.trend)}%
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Events card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cursor-pointer"
          onClick={() => handleCardClick("/admin/events")}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 hover:border-orange-200 transition-all p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-xl">
                  {eventsStats.icon}
                </div>
                <h3 className="font-medium text-gray-700">{eventsStats.title}</h3>
              </div>
            </div>
            <p className="text-4xl font-bold">{eventsStats.value}</p>
            <p className="text-sm text-gray-500 mt-2">{eventsStats.description}</p>
            {eventsStats.trend !== undefined && (
              <div className={`inline-flex items-center gap-1 px-2 py-1 mt-3 rounded-full text-sm ${eventsStats.trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {eventsStats.trend > 0 ? '↑' : '↓'} {Math.abs(eventsStats.trend)}%
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Internal MiniChart component for the user stats
const MiniChart = ({ data, color }: { data: { name: string; value: number }[], color: string }) => {
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
      <div className="h-full bg-gradient-to-t from-blue-50 to-transparent">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="h-full w-full">
          <path
            d={`M0,20 ${data.map((d, i) => `L${i * (100 / (data.length - 1))},${20 - (d.value / Math.max(...data.map(d => d.value)) * 20)}`).join(' ')} L100,20 Z`}
            fill={`${chartColor}20`}
            stroke={chartColor}
            strokeWidth="0.5"
          />
        </svg>
      </div>
    </div>
  );
};