import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface Skill {
  name: string;
  points: number;
  maxPoints: number;
  color: string;
}

const skills: Skill[] = [
  { name: "Programming", points: 8, maxPoints: 10, color: "#34D399" },
  { name: "Crypto", points: 5, maxPoints: 10, color: "#60A5FA" },
  { name: "Data Analysis", points: 6, maxPoints: 10, color: "#F472B6" },
  { name: "Machine Learning", points: 4, maxPoints: 10, color: "#FBBF24" },
  { name: "DSA", points: 4, maxPoints: 10, color: "#A78BFA" },
];

const SkillDevelopment = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [chartSize, setChartSize] = useState(400);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 400) {
        setChartSize(280);
      } else if (width < 640) {
        setChartSize(320);
      } else {
        setChartSize(400);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const radius = chartSize * 0.3; // Further reduced radius for more label space
  const angleStep = (2 * Math.PI) / skills.length;

  const getPointCoordinates = (
    angle: number,
    value: number,
    maxValue: number,
  ) => {
    const distance = (value / maxValue) * radius;
    return {
      x: centerX + distance * Math.cos(angle - Math.PI / 2),
      y: centerY + distance * Math.sin(angle - Math.PI / 2),
    };
  };

  const getAxisCoordinates = (angle: number) => {
    return {
      x: centerX + radius * Math.cos(angle - Math.PI / 2),
      y: centerY + radius * Math.sin(angle - Math.PI / 2),
    };
  };

  const getLabelPosition = (angle: number) => {
    const labelRadius = radius + (chartSize < 400 ? 45 : 60); // Increased label distance
    const x = centerX + labelRadius * Math.cos(angle - Math.PI / 2);
    const y = centerY + labelRadius * Math.sin(angle - Math.PI / 2);
    return { x, y };
  };

  const points = skills.map((skill, index) => {
    const angle = index * angleStep;
    return getPointCoordinates(angle, skill.points, skill.maxPoints);
  });

  const pathData =
    points.reduce((path, point, index) => {
      return (
        path +
        (index === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`)
      );
    }, "") + " Z";

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 max-w-3xl w-full">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Skill Radar
        </h1>
      </div>

      <div className="relative w-full flex justify-center">
        <div
          className="relative"
          style={{ width: chartSize, height: chartSize }}
        >
          <svg width={chartSize} height={chartSize}>
            {/* Background circles with labels */}
            {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
              <g key={i}>
                <motion.circle
                  cx={centerX}
                  cy={centerY}
                  r={radius * scale}
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
                <text
                  x={centerX + 5}
                  y={centerY - radius * scale}
                  className="text-xs fill-gray-400"
                >
                  {scale * 10}
                </text>
              </g>
            ))}

            {/* Axis lines */}
            {skills.map((_, index) => {
              const angle = index * angleStep;
              const end = getAxisCoordinates(angle);
              return (
                <motion.line
                  key={index}
                  x1={centerX}
                  y1={centerY}
                  x2={end.x}
                  y2={end.y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              );
            })}

            {/* Skill area */}
            <motion.path
              d={pathData}
              fill="rgba(147, 197, 253, 0.2)"
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Skill points */}
            {points.map((point, index) => (
              <motion.circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={chartSize < 400 ? "4" : "6"}
                fill={skills[index].color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.5 }}
                transition={{ delay: 2 + index * 0.1 }}
                className="cursor-pointer"
                onClick={() => setSelectedSkill(skills[index])}
              />
            ))}
          </svg>

          {/* Skill labels */}
          {skills.map((skill, index) => {
            const angle = index * angleStep;
            const labelPos = getLabelPosition(angle);

            // Adjust label positioning based on angle
            const isTop = labelPos.y < centerY;
            const isRight = labelPos.x > centerX;
            const isExactTop = Math.abs(labelPos.x - centerX) < 10;
            const isExactBottom =
              Math.abs(labelPos.x - centerX) < 10 && labelPos.y > centerY;

            let alignClass =
              isExactTop || isExactBottom
                ? "text-center"
                : isRight
                  ? "text-left"
                  : "text-right";

            return (
              <motion.div
                key={index}
                className={`absolute w-24 sm:w-28 ${alignClass}`}
                style={{
                  left:
                    labelPos.x -
                    (isExactTop || isExactBottom ? 40 : isRight ? 0 : 80),
                  top: labelPos.y - (isTop ? 40 : -20),
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <div
                  className={`flex flex-col ${
                    alignClass === "text-center"
                      ? "items-center"
                      : alignClass === "text-left"
                        ? "items-start"
                        : "items-end"
                  }`}
                >
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">
                    {skill.name}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {skill.points}/{skill.maxPoints}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Skill detail popup */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            className="fixed inset-x-0 bottom-0 sm:relative sm:mt-8 mx-4 sm:mx-0"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
          >
            <div className="bg-white sm:bg-blue-50 p-6 rounded-t-2xl sm:rounded-2xl shadow-lg sm:shadow-md border-t sm:border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedSkill.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Proficiency Level: {selectedSkill.points}/10
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <motion.div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: selectedSkill.color,
                    width: `${(selectedSkill.points / selectedSkill.maxPoints) * 100}%`,
                  }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(selectedSkill.points / selectedSkill.maxPoints) * 100}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Click on different skill points to see detailed information.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 hidden sm:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
      >
        <p className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Click on the skill points to see detailed information. The further a
          point is from the center, the higher the skill level.
        </p>
      </motion.div>
    </div>
  );
};

export default SkillDevelopment;
