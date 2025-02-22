import { UserApproval } from './UserApproval';
import { PaperReview } from './PaperReview';

const ApprovalsTab = () => (
  <div className="space-y-6">
    <UserApproval />
    <PaperReview />
  </div>
);

export default ApprovalsTab;