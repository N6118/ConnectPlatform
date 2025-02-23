import { UserApproval } from '@/components/UserApproval';
import { PaperReview } from '@/components/PaperReview';
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
const ApprovalsTab = () => {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <AdminNavbar />
      <div className="space-y-6 p-10">
        <UserApproval />
        <PaperReview />
      </div>
      {isMobile && <AdminMobileBottomNav />}

    </div>
  );
};

export default ApprovalsTab;