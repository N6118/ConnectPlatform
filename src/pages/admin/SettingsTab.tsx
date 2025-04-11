import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const settingsOptions = [
  {
    title: "Notifications",
    description: "Configure notification preferences",
  },
  {
    title: "Data Export",
    description: "Manage export settings",
  },
  {
    title: "User Permissions",
    description: "Manage role permissions",
  },
  {
    title: "API Access",
    description: "Manage API keys and access",
  },
];

export const SettingsTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Dashboard Settings</CardTitle>
      <CardDescription>Configure your dashboard preferences</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {settingsOptions.map((option) => (
          <div key={option.title} className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{option.title}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default SettingsTab;