import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
const PerformanceOverview = () => {
  const tps = 0.65;
  const thresholdLevel = "Intermediate";
  const capacity = 7;
  const workload = 5;
  const thresholdColors = {
    Beginner: "bg-blue-500",
    Intermediate: "bg-yellow-500",
    Professional: "bg-purple-500",
    Advanced: "bg-green-500",
  };
  const workloadColor =
    workload / capacity > 0.8 ? "bg-red-500" : "bg-green-500";
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-extrabold mb-6 text-gray-800">
        Performance Overview
      </h2>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="w-32 sm:w-1/3">
          <CircularProgressbar
            value={tps * 100}
            text={`${(tps * 100).toFixed(0)}%`}
            styles={buildStyles({
              textColor: "#3B82F6",
              pathColor: "#3B82F6",
              trailColor: "#D1D5DB",
            })}
          />
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg ${
            thresholdColors[thresholdLevel]
          }`}
        >
          {thresholdLevel}
        </motion.div>
      </div>
      <div className="mb-6">
        <p className="text-base sm:text-lg font-medium mb-2 text-gray-700">
          Capacity: {workload} / {capacity}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-3 ${workloadColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${(workload / capacity) * 100}%` }}
            transition={{ duration: 1 }}
          ></motion.div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
          TPS Breakdown
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p>Projects: 40%</p>
            <p>Feedback: 30%</p>
          </div>
          <div>
            <p>Extracurricular: 20%</p>
            <p>Papers: 30%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PerformanceOverview;
