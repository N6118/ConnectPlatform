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

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />
        
        <TabNavigation>
          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="clubs">
            <ClubManagement />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsTab />
          </TabsContent>

          <TabsContent value="publications">
            <PublicationsTab />
          </TabsContent>

          <TabsContent value="approvals">
            <ApprovalsTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </TabNavigation>
      </div>
    </div>
  );
};

export default Dashboard;