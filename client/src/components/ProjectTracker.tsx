import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Clock, Calendar } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: "ongoing" | "completed" | "dropped";
  progress: number;
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Building a modern e-commerce platform with React and Node.js",
    deadline: "2024-04-15",
    status: "ongoing",
    progress: 65,
  },
  {
    id: 2,
    title: "Dashboard Redesign",
    description: "Modernizing the analytics dashboard UI",
    deadline: "2024-04-20",
    status: "ongoing",
    progress: 45,
  },
  {
    id: 3,
    title: "New AI Model",
    description: "Developing an AI model for predictive analysis",
    deadline: "2024-06-10",
    status: "ongoing",
    progress: 25,
  },
];

const ProjectOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed" | "dropped">("ongoing");
  const [showAll, setShowAll] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-50 border-blue-200";
      case "completed":
        return "bg-green-50 border-green-200";
      case "dropped":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ongoing":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "dropped":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? `${diffDays} days left` : "Deadline passed";
  };

  const filteredProjects = projects.filter((project) => project.status === activeTab);
  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, 3);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Project Overview</h2>

      {/* Tabs Section */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["ongoing", "completed", "dropped"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as "ongoing" | "completed" | "dropped");
              setShowAll(false);
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeTab === tab
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({projects.filter((p) => p.status === tab).length})
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-3">
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className={`rounded-lg border p-4 transition-all duration-300 hover:shadow-lg ${getStatusColor(
                project.status
              )}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {project.description}
                  </p>
                </div>
                {getStatusIcon(project.status)}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Deadline: {formatDate(project.deadline)}
                  </span>
                </div>

                {project.status === "ongoing" && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {project.progress}% Complete
                      </span>
                      <span className="text-blue-600 font-medium">
                        {getDaysRemaining(project.deadline)}
                      </span>
                    </div>
                  </>
                )}
                {project.status === "completed" && (
                  <span className="inline-flex items-center text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Completed
                  </span>
                )}
                {project.status === "dropped" && (
                  <span className="inline-flex items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Dropped
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View More Button */}
      {filteredProjects.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full text-blue-600 font-medium py-2 px-4 rounded-lg border border-blue-500 hover:bg-blue-50 transition"
        >
          {showAll ? "View Less" : "View More"}
        </button>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <p className="text-gray-600 text-center py-4">
          No projects in this category.
        </p>
      )}
    </div>
  );
};

export default ProjectOverview;