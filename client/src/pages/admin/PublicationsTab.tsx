import { PublicationsChart } from './PublicationsChart';
import { PaperReview } from './PaperReview';

export const PublicationsTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <PublicationsChart />
    <PaperReview />
  </div>
);

export default PublicationsTab;