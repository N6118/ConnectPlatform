import React, { useState } from "react";
import Carousel from "@/components/CommonDashboard-components/Carousel";
import ActivityFeed from "@/components/CommonDashboard-components/ActivityFeed";
import PerformanceOverview from "@/components/StudentDashboard-components/PerformanceOverview";
import ProjectTracker from "@/components/CommonDashboard-components/ProjectTracker";
import SkillDevelopment from "@/components/StudentDashboard-components/SkillDevelopment";
import CalendarView from "@/components/CommonDashboard-components/CalendarView";
import CreatePostButton from "@/components/CommonDashboard-components/CreatePostButton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StudentNavbar from "@/components/navigation/StudentNavbar";
import { SwipeableCard } from "@/components/ui/swipeable-card";

export default function StudentDashboard() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setActiveComponent(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const components = [
    {
      id: "performance",
      title: "Performance Overview",
      component: <PerformanceOverview />,
    },
    {
      id: "skills",
      title: "Skill Development",
      component: <SkillDevelopment />,
    },
    { id: "projects", title: "Project Tracker", component: <ProjectTracker /> },
    { id: "calendar", title: "Calendar", component: <CalendarView /> },
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

  const renderMobileView = () => (
    <div className="space-y-4 p-4">
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

  const renderDesktopView = () => (
    <>
      <StudentNavbar />
      <div className="min-h-screen p-4 flex flex-wrap lg:flex-nowrap gap-4">
        {/* Left Column: Performance Overview and Skill Development */}
        <div className="w-full lg:w-1/4 space-y-4">
          <div className="bg-card rounded-lg p-4 shadow">
            <PerformanceOverview />
          </div>
          <div className="bg-card rounded-lg p-4 shadow">
            <SkillDevelopment />
          </div>
        </div>

        {/* Center Column: Activity Feed */}
        <div className="w-full lg:w-2/4 space-y-4">
          <div>
            <Carousel />
          </div>
          <CreatePostButton />
          <ActivityFeed />
        </div>

        {/* Right Column: Calendar and Project Tracker */}
        <div className="w-full lg:w-1/4 space-y-4">
          <div className="bg-card rounded-lg p-4 shadow">
            <CalendarView />
          </div>
          <div className="bg-card rounded-lg p-4 shadow">
            <ProjectTracker />
          </div>
        </div>
      </div>
    </>
  );

  return isMobileView ? renderMobileView() : renderDesktopView();
}