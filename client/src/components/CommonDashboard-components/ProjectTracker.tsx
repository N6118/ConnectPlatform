import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Clock, Calendar } from "lucide-react";
import { Link } from "wouter";

interface Project {
  title: string;
  description: string;
  tag: string;
  status: "Not Started" | "In Progress" | "Completed";
  level: "Easy" | "Medium" | "Difficult";
  duration: string;
  mentor: string;
  prerequisites: string;
  techStack: string;
  skills: string;
  maxTeamSize: string;
  isOpenForApplications: boolean;
  applicants: {
    id: string;
    name: string;
    email: string;
    status: "pending" | "accepted" | "rejected" | "waitlisted";
    appliedDate: string;
    experience: string;
    notes?: string;
  }[];
}

const projects: Project[] = [
  {
    title: "AI Research Project",
    description: "Exploring applications of AI in education",
    tag: "AI",
    status: "In Progress",
    level: "Medium",
    duration: "3 months",
    mentor: "Dr. Smith",
    prerequisites: "Basic ML knowledge",
    techStack: "Python, TensorFlow",
    skills: "Machine Learning, Data Analysis",
    maxTeamSize: "4",
    isOpenForApplications: true,
    applicants: [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        status: "pending",
        appliedDate: "2024-03-15",
        experience: "2 years of ML experience, worked on NLP projects",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        status: "accepted",
        appliedDate: "2024-03-14",
        experience: "ML researcher, published papers in computer vision",
        notes: "Strong candidate with relevant research experience",
      },
    ],
  },
  {
    title: "Web Development",
    description: "Building a Faculty collaboration platform",
    tag: "Web",
    status: "Not Started",
    level: "Easy",
    duration: "2 months",
    mentor: "Prof. Johnson",
    prerequisites: "HTML, CSS, JS",
    techStack: "React, Node.js",
    skills: "Frontend Development, API Integration",
    maxTeamSize: "3",
    isOpenForApplications: true,
    applicants: [],
  },
];

const ProjectOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Not Started" | "In Progress" | "Completed">("In Progress");
  const [showAll, setShowAll] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "bg-yellow-50 border-yellow-200";
      case "In Progress":
        return "bg-blue-50 border-blue-200";
      case "Completed":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Not Started":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "In Progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "Completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const filteredProjects = projects.filter(
    (project) => project.status === activeTab
  );
  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, 3);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Project Overview</h1>

      {/* Tabs Section */}
      <div className="flex space-x-6 border-b mb-6">
        {["Not Started", "In Progress", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as "Not Started" | "In Progress" | "Completed");
              setShowAll(false);
            }}
            className={`py-2 px-4 font-medium border-b-2 transition-colors duration-200 ${
              activeTab === tab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab} ({projects.filter((p) => p.status === tab).length})
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="flex flex-col space-y-4">
        {visibleProjects.map((project) => (
          <Link
            key={project.title}
            href={`/faculty/projectdetails?title=${encodeURIComponent(project.title)}`}
          >
            <div
              className={`rounded-lg border p-6 transition-all duration-300 hover:shadow-lg cursor-pointer ${getStatusColor(
                project.status
              )}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {project.description}
                  </p>
                </div>
                {getStatusIcon(project.status)}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Duration: {project.duration}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {project.tag}
                  </span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {project.level}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  Team Size: {project.applicants.filter(a => a.status === "accepted").length} / {project.maxTeamSize}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View More Button */}
      {filteredProjects.length > 3 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 font-medium border border-blue-500 rounded-lg px-4 py-2 hover:bg-blue-100 transition"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      )}

      {/* Show a message if there are no projects in the selected tab */}
      {filteredProjects.length === 0 && (
        <p className="text-gray-600 text-center mt-6">
          No projects in this category.
        </p>
      )}
    </div>
  );
};

export default ProjectOverview;
