import { ActivityFeed } from "@/components/ActivityFeed";
import { ProjectTracker } from "@/components/ProjectTracker";
import { WorkList } from "@/components/WorkList";
import { QuickProjectStats } from "@/components/QuickProjectStats";

export default function MySpace() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <QuickProjectStats />
        <ProjectTracker />
      </div>
      <div className="space-y-6">
        <ActivityFeed />
        <WorkList />
      </div>
    </div>
  );
}
