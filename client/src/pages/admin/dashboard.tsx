import { TabsContent } from "@/components/ui/tabs";
import { DashboardHeader } from './DashboardHeader';
import { TabNavigation } from './TabNavigation';
import { OverviewTab } from './OverviewTab';
import { UsersTab } from './UsersTab';
import { ClubManagement } from './ClubManagement';
import { ProjectsTab } from './ProjectsTab';
import { PublicationsTab } from './PublicationsTab';
import ApprovalsTab from './ApprovalsTab';
import { SettingsTab } from './SettingsTab';
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <OverviewTab />
      {isMobile && <AdminMobileBottomNav />}
    </div>
  );
};

export default Dashboard;