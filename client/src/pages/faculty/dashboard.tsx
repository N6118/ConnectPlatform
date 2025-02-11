import React from "react";
import Carousel from "../../components/Carousel";
import ActivityFeed from "../../components/ActivityFeed";
import ProjectTracker from "../../components/ProjectTracker";
import CalendarView from "../../components/CalendarView";
import ApplicantManagement from "../../components/ApplicantManagement";
import QuickProjectStats from "../../components/QuickProjectStats";
import VerificationRequests from "../../components/VerificationRequests";
import CreatePostButton from "../../components/CreatePostButton";

const FacultyDashboard = () => {
  const ongoingProjects = 5;
  const completedProjects = 12;

  const verificationRequestsData = [
    {
      studentName: "Sajith Rajan",
      projectName: "Sign Language Detection",
      role: "Team Lead",
      details:
        "Worked on developing machine learning models for predicting outcomes.",
    },
    {
      studentName: "Ramya C",
      projectName: "Web Development Project",
      role: "Frontend Developer",
      details: "Designed the user interface and integrated API services.",
    },
  ];

  return (
    <div className="font-poppins text-textBlue min-h-screen p-4 flex">
      <div className="w-1/4 pr-4">
        <QuickProjectStats
          ongoing={ongoingProjects}
          completed={completedProjects}
        />
        <ApplicantManagement />
        <VerificationRequests requests={verificationRequestsData} />
      </div>

      <div className="w-2/4 space-y-4">
        <div>
          <Carousel />
        </div>
        <CreatePostButton />
        <ActivityFeed />
      </div>

      <div className="w-1/4 pl-4">
        <div className="mb-6">
          <CalendarView />
        </div>
        <div className="mb-6">
          <ProjectTracker />
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
