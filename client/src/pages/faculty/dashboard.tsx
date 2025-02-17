import React, { useState, useEffect } from "react";
import Carousel from "@/components/CommonDashboard-components/Carousel";
import ActivityFeed from "@/components/CommonDashboard-components/ActivityFeed";
import ProjectTracker from "@/components/CommonDashboard-components/ProjectTracker";
import CalendarView from "@/components/CommonDashboard-components/CalendarView";
import ApplicantManagement from "@/components/FacultyDashboard-components/ApplicantManagement";
import QuickProjectStats from "@/components/FacultyDashboard-components/QuickProjectStats";
import VerificationRequests from "@/components/FacultyDashboard-components/VerificationRequests";
import CreatePostButton from "@/components/CommonDashboard-components/CreatePostButton";
import FacultyNavbar from "@/components/navigation/FacultyNavbar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { SwipeableCard } from "@/components/ui/swipeable-card";

const FacultyDashboard = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample data for activity stats
  const activityStats = {
    ongoingProjects: 5,
    completedProjects: 12,
    inworkPapers: 3,
    publishedPapers: 8
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setActiveComponent(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const components = [
    {
      id: "stats",
      title: "Quick Stats",
      component: (
        <QuickProjectStats
          ongoingProjects={activityStats.ongoingProjects}
          completedProjects={activityStats.completedProjects}
          inworkPapers={activityStats.inworkPapers}
          publishedPapers={activityStats.publishedPapers}
        />
      ),
    },
    {
      id: "applicants",
      title: "Applicant Management",
      component: <ApplicantManagement />,
    },
    {
      id: "verification",
      title: "Verification Requests",
      component: <VerificationRequests requests={verificationRequestsData} />,
    },
    {
      id: "projects",
      title: "Project Tracker",
      component: <ProjectTracker />,
    },
    {
      id: "calendar",
      title: "Calendar",
      component: <CalendarView />,
    },
  ];

  const renderMobileView = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {components.map((comp, index) => (
          <Button
            key={comp.id}
            variant={activeComponent === comp.id ? "default" : "outline"}
            onClick={() => {
              setActiveComponent(activeComponent === comp.id ? null : comp.id);
              setCurrentIndex(index);
            }}
            className="flex-1"
          >
            {comp.title}
          </Button>
        ))}
      </div>

      {activeComponent && (
        <SwipeableCard
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          className="bg-card rounded-lg p-4 shadow-lg"
        >
          {components.find((c) => c.id === activeComponent)?.component}
        </SwipeableCard>
      )}

      <div>
        <Carousel />
      </div>
      <CreatePostButton />
      <ActivityFeed />
    </div>
  );

  const handleSwipeLeft = () => {
    if (currentIndex < components.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setActiveComponent(components[currentIndex + 1].id);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setActiveComponent(components[currentIndex - 1].id);
    }
  };

  const renderDesktopView = () => (
    <div className="min-h-full p-3 flex flex-wrap lg:flex-nowrap gap-4">
      {/* Left Column */}
      <div className="w-full lg:w-1/4 space-y-4">
        <div className="bg-card rounded-lg p-4 shadow">
          <QuickProjectStats
            ongoingProjects={activityStats.ongoingProjects}
            completedProjects={activityStats.completedProjects}
            inworkPapers={activityStats.inworkPapers}
            publishedPapers={activityStats.publishedPapers}
          />
        </div>
        <div className="bg-card rounded-lg p-4 shadow">
          
          <ProjectTracker />
        </div>
       
      </div>

      {/* Center Column */}
      <div className="w-full lg:w-2/4 space-y-4">
        <div>
          <Carousel />
        </div>
        <CreatePostButton />
        <ActivityFeed />
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/4 space-y-4">
        <div className="bg-card rounded-lg p-4 shadow">
        <ApplicantManagement />
        </div>
        <div className="bg-card rounded-lg p-4 shadow">
          <VerificationRequests requests={verificationRequestsData} />
        </div>
        <div className="bg-card rounded-lg p-4 shadow">
          <CalendarView />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen pb-12 md:pb-0">
      <FacultyNavbar />
      <div className=" mx-auto py-4 px-4">
        {isMobile ? renderMobileView() : renderDesktopView()}
      </div>
      {isMobile && <MobileBottomNav role="faculty" />}
    </div>
  );
};
export default FacultyDashboard;
