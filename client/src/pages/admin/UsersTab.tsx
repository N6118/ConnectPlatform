import { UserActivityChart } from '@/components/UserActivityChart';
import { UserApproval } from '../../components/UserApproval';
import AdminNavbar from '@/components/navigation/AdminNavbar';
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

export const UsersTab = () => {
  const isMobile = useIsMobile();
return (
  <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
    <AdminNavbar />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-10 py-20">
      <UserActivityChart />
      <div className="grid grid-cols-1 gap-6">
        <UserApproval />
      </div>
      {isMobile && <AdminMobileBottomNav />}

    </div>
  </div>
);
}

export default UsersTab;