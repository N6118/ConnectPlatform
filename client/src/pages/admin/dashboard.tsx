import { UserActivityChart } from '@/components/UserActivityChart';
import { StatsGrid } from '../../components/AdminStat-components/StatsGrid';
import AdminNavbar from '@/components/navigation/AdminNavbar';
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

export const Dashboard = () => {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <AdminNavbar />
      <div className='px-20 py-12 md:px-10 md:py-10'>
        <StatsGrid />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserActivityChart />
        </div>
      </div>
      {isMobile && <AdminMobileBottomNav />}
    </div>
  );
};

export default Dashboard;