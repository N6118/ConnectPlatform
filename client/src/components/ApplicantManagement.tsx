import React, { useState } from "react";
import { FaCheck, FaTimes, FaExclamationCircle } from "react-icons/fa";

interface Applicant {
  name: string;
  role: string;
  tps: number;
  commitmentScore: number;
  capacity: number;
  projectLevel: "Easy" | "Medium" | "Hard";
}

interface Project {
  name: string;
  applicants: Applicant[];
}

const ApplicantManagement: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"name" | "tps" | "commitmentScore">(
    "name",
  );

  const projects: Project[] = [
    {
      name: "Lam Project",
      applicants: [
        {
          name: "Sai Manikanta",
          role: "Developer",
          tps: 0.75,
          commitmentScore: 0.85,
          capacity: 8,
          projectLevel: "Medium",
        },
        {
          name: "Hasanthi",
          role: "Analyst",
          tps: 0.45,
          commitmentScore: 0.55,
          capacity: 7,
          projectLevel: "Easy",
        },
      ],
    },
    {
      name: "Sony Project",
      applicants: [
        {
          name: "Alice Johnson",
          role: "Researcher",
          tps: 0.65,
          commitmentScore: 0.7,
          capacity: 6,
          projectLevel: "Medium",
        },
      ],
    },
  ];

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Project Applicant Management
      </h2>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-md flex justify-between items-center bg-white hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleProjectClick(project)}
          >
            <div>
              <p className="text-lg font-bold text-gray-800">{project.name}</p>
              <p className="text-gray-600">
                {project.applicants.length} Applicants
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-2/3">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              Applicants for {selectedProject.name}
            </h3>
            <div className="mb-4">
              <label className="mr-2 text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "name" | "tps" | "commitmentScore",
                  )
                }
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="tps">TPS</option>
                <option value="commitmentScore">Commitment Score</option>
              </select>
            </div>
            <div className="space-y-4">
              {selectedProject.applicants.map((applicant, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-md flex justify-between items-center bg-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      {applicant.name}
                    </p>
                    <p className="text-gray-600">
                      {selectedProject.name} - {applicant.role}
                    </p>
                    <div className="flex space-x-4 mt-2">
                      <button className="text-green-500 hover:text-green-700 transition-colors">
                        <FaCheck size={24} />
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <FaTimes size={24} />
                      </button>
                      <button className="text-yellow-500 hover:text-yellow-700 transition-colors">
                        <FaExclamationCircle size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {applicant.tps.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Capacity: {applicant.capacity}
                    </p>
                    <p className="text-sm text-gray-500">
                      CC: {applicant.commitmentScore.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantManagement;
