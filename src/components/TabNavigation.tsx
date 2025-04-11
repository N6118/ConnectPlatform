import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
  value: string;
  label: string;
}

const tabs: Tab[] = [
  { value: "overview", label: "Overview" },
  { value: "users", label: "Users" },
  { value: "clubs", label: "Clubs" },
  { value: "projects", label: "Projects" },
  { value: "publications", label: "Publications" },
  { value: "approvals", label: "Approvals" },
  { value: "settings", label: "Settings" },
];

interface TabNavigationProps {
  children: React.ReactNode;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ children }) => (
  <Tabs defaultValue="overview" className="space-y-6">
    <TabsList className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="flex-1 min-w-[100px] md:flex-none"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
    {children}
  </Tabs>
);