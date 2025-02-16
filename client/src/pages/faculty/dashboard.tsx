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
import { SwipeableCard } from "@/components/ui/swipeable-card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useIsMobile } from "@/hooks/use-mobile";

const FacultyDashboard = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);

  const ongoingProjects = 5;
  const completedProjects = 12;

  useEffect(() => {
    const handleResize = () => {
      //setIsMobileView(window.innerWidth < 768); // Removed - using useIsMobile
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
      details: "Worked on developing machine learning models for predicting outcomes.",
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
      component: <QuickProjectStats ongoing={ongoingProjects} completed={completedProjects} />,
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

  // Mobile-optimized visualization data
  const projectData = [
    { name: 'AI/ML', value: 35 },
    { name: 'Web Dev', value: 25 },
    { name: 'Mobile', value: 20 },
    { name: 'IoT', value: 15 },
  ];

  const progressData = [
    { month: 'Jan', projects: 4 },
    { month: 'Feb', projects: 6 },
    { month: 'Mar', projects: 8 },
    { month: 'Apr', projects: 7 },
    { month: 'May', projects: 9 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderMobileCharts = () => (
    <div className="space-y-4">
      <div className="bg-card p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Project Distribution</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {projectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div className="space-y-4 p-4 pb-20">
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

      {renderMobileCharts()}

      <div>
        <Carousel />
      </div>
      <CreatePostButton />
      <ActivityFeed />
    </div>
  );

  const renderDesktopView = () => (
    <div className="min-h-screen p-4 flex flex-wrap lg:flex-nowrap gap-4">
      {/* Left Column */}
      <div className="w-full lg:w-1/4 space-y-4">
        <div className="bg-card rounded-lg p-4 shadow">
          <QuickProjectStats ongoing={ongoingProjects} completed={completedProjects} />
        </div>
        <div className="bg-card rounded-lg p-4 shadow">
          <ApplicantManagement />
        </div>
        <div className="bg-card rounded-lg p-4 shadow">
          <VerificationRequests requests={verificationRequestsData} />
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
          <ProjectTracker />
        </div>
        <div className="bg-card rounded-lg p-4 shadow">
          <CalendarView />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen pb-16 md:pb-0">
      <FacultyNavbar />
      {isMobile ? renderMobileView() : renderDesktopView()}
      {isMobile && <MobileBottomNav role="faculty" />}
    </div>
  );
};

export default FacultyDashboard;