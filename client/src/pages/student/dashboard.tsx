import React from 'react';
import Carousel from '../../components/Carousel';
import ActivityFeed from '../../components/ActivityFeed';
import PerformanceOverview from '../../components/PerformanceOverview';
import ProjectTracker from '../../components/ProjectTracker';
import SkillDevelopment from '../../components/SkillDevelopment';
import CalendarView from '../../components/CalendarView';
import CreatePostButton from '../../components/CreatePostButton';

export default function StudentDashboard() {
  return (
    <div className="min-h-screen p-4 flex gap-4">
      {/* Left Column: Performance Overview and Skill Development */}
      <div className="w-1/4 space-y-4">
        <div>
          <PerformanceOverview />
        </div>
        <div>
          <SkillDevelopment />
        </div>
      </div>

      {/* Center Column: Activity Feed */}
      <div className="w-2/4 space-y-4">
        <div>
          <Carousel />
        </div>
        <CreatePostButton />
        <ActivityFeed />
      </div>

      {/* Right Column: Calendar and Project Tracker */}
      <div className="w-1/4 space-y-4">
        <div>
          <CalendarView />
        </div>
        <div>
          <ProjectTracker />
        </div>
      </div>
    </div>
  );
}