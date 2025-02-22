import { PublicationsChart } from './PublicationsChart';
import { PaperReview } from './PaperReview';
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

export const PublicationsTab = () => {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <AdminNavbar />
      <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PublicationsChart />
        <PaperReview />
      </div>
      {isMobile && <AdminMobileBottomNav />}
    </div>
  );
};

export default PublicationsTab;