import { UserActivityChart } from './UserActivityChart';
import { StatsGrid } from './StatsGrid';

export const OverviewTab = () => (
  <div>
    <StatsGrid />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UserActivityChart />
    </div>
  </div>
);

export default OverviewTab;