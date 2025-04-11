import React, { useState } from "react";
import { Project } from "@/types/project";
import ApplicantsModal from "@/components/ApplicantsModal";

const ApplicantManagement: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);

  // Using the same project data as my-space
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
      imageUrl: "https://media.istockphoto.com/id/1432955867/vector/technology-abstract-lines-and-dots-connect-background-with-hexagons-hexagon-grid-hexagons.jpg?s=612x612&w=0&k=20&c=gSMTHNjpqgpDU06e3G8GhQTUcqEcWfvafMFjzT3qzzQ=",
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

  const handleUpdateApplicantStatus = (
    applicantId: string,
    newStatus: "pending" | "accepted" | "rejected" | "waitlisted"
  ) => {
    if (!selectedProject) return;
    
    setSelectedProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        applicants: prev.applicants.map(applicant =>
          applicant.id === applicantId
            ? { ...applicant, status: newStatus }
            : applicant
        ),
      };
    });
  };

  const handleAddApplicantNote = (applicantId: string, note: string) => {
    if (!selectedProject) return;
    
    setSelectedProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        applicants: prev.applicants.map(applicant =>
          applicant.id === applicantId
            ? { ...applicant, notes: note }
            : applicant
        ),
      };
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Applicant Management
      </h2>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.title}
            className="p-4 border rounded-lg shadow-md flex justify-between items-center bg-white hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedProject(project);
              setShowApplicantsModal(true);
            }}
          >
            <div>
              <p className="text-lg font-bold text-gray-800">{project.title}</p>
              <p className="text-gray-600">
                {project.applicants.length} Applicants
              </p>
            </div>
          </div>
        ))}
      </div>

      {showApplicantsModal && selectedProject && (
        <ApplicantsModal
          projectTitle={selectedProject.title}
          applicants={selectedProject.applicants}
          onClose={() => {
            setShowApplicantsModal(false);
            setSelectedProject(null);
          }}
          onUpdateStatus={handleUpdateApplicantStatus}
          onAddNote={handleAddApplicantNote}
        />
      )}
    </div>
  );
};

export default ApplicantManagement;
