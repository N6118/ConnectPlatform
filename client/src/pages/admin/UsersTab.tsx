import { UserActivityChart } from './UserActivityChart';
import { UserApproval } from './UserApproval';

export const UsersTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <UserActivityChart />
    <div className="grid grid-cols-1 gap-6">
      <UserApproval />
    </div>
  </div>
);

export default UsersTab;