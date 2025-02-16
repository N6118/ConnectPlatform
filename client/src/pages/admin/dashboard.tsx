import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { TabNavigation } from './TabNavigation';
import { StatCard } from './StatCard';
import { UserActivityChart } from './UserActivityChart';
import { motion } from "framer-motion";
import {
  Users, FileText, Settings, Activity, Shield, BookOpen,
  Plus, Upload, FormInput, Send, Folder, File, ChevronDown,
  Download, UserPlus, Award, Newspaper, Calendar, Clock,
  TrendingUp, UserCheck, Building, BookMarked, Target,
  Globe, Star, Medal, Coffee, UserCog, Filter
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell, Area, AreaChart,
  ComposedChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import html2canvas from 'html2canvas';
import { ChartContainer } from './ChartContainer';

const ProjectsChart = () => {
  const projectData = [
    { month: 'Jan', ongoing: 24, completed: 18, success: 85 },
    { month: 'Feb', ongoing: 28, completed: 22, success: 88 },
    { month: 'Mar', ongoing: 32, completed: 25, success: 82 },
    { month: 'Apr', ongoing: 35, completed: 30, success: 90 },
    { month: 'May', ongoing: 30, completed: 28, success: 87 },
  ];

  return (
    <ChartContainer
      title="Project Performance Metrics"
      description="Track project status and completion rates"
      filename="projects"
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="ongoing" stackId="a" fill="#0088FE" />
            <Bar yAxisId="left" dataKey="completed" stackId="a" fill="#00C49F" />
            <Line yAxisId="right" type="monotone" dataKey="success" stroke="#FFBB28" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

// New Club Management Component
const ClubManagement = () => {
  const clubData = [
    {
      name: 'Tech Club',
      members: 120,
      events: 45,
      budget: 5000,
      advisor: 'Dr. Smith',
      status: 'active',
      engagement: [85, 78, 90, 88, 92]
    },
    // ... more club data
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Club Management</CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> New Club
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Club Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Advisor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubData.map((club) => (
                <TableRow key={club.name}>
                  <TableCell>{club.name}</TableCell>
                  <TableCell>{club.members}</TableCell>
                  <TableCell>{club.events}</TableCell>
                  <TableCell>${club.budget}</TableCell>
                  <TableCell>{club.advisor}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${club.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {club.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ChartContainer
        title="Club Engagement Metrics"
        description="Track club performance and member participation"
        filename="club-metrics"
      >
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={clubData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <Radar name="Engagement" dataKey="engagement" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </div>
  );
};

// New User Approval Component
const UserApproval = () => {
  const pendingUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@university.edu',
      role: 'Student',
      department: 'Computer Science',
      requestDate: '2024-02-15'
    },
    // ... more pending users
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending User Approvals</CardTitle>
        <CardDescription>Review and approve new user registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.requestDate}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">Approve</Button>
                    <Button variant="destructive" size="sm">Reject</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Paper Review System Component
const PaperReview = () => {
  const papers = [
    {
      id: 1,
      title: 'Advanced Machine Learning Applications',
      author: 'Dr. Jane Smith',
      department: 'Computer Science',
      status: 'Under Review',
      reviewers: ['Dr. Johnson', 'Dr. Williams'],
      submissionDate: '2024-02-10'
    },
    // ... more papers
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paper Review System</CardTitle>
        <CardDescription>Manage academic paper submissions and reviews</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reviewers</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {papers.map((paper) => (
              <TableRow key={paper.id}>
                <TableCell>{paper.title}</TableCell>
                <TableCell>{paper.author}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${paper.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {paper.status}
                  </span>
                </TableCell>
                <TableCell>{paper.reviewers.join(', ')}</TableCell>
                <TableCell>{paper.submissionDate}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Manage Review</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    icon: <Users className="w-5 h-5 text-primary" />,
    description: "Active users across all roles",
    trend: 12,
    color: "blue"
  },
  {
    title: "Research Projects",
    value: "156",
    icon: <Target className="w-5 h-5 text-primary" />,
    description: "Ongoing research initiatives",
    trend: 15,
    color: "green"
  },
  {
    title: "Publications",
    value: "89",
    icon: <BookMarked className="w-5 h-5 text-primary" />,
    description: "Papers published this year",
    trend: 8,
    color: "purple"
  },
  {
    title: "Faculty Members",
    value: "245",
    icon: <UserCheck className="w-5 h-5 text-primary" />,
    description: "Active teaching staff",
    trend: 5,
    color: "orange"
  },
  {
    title: "Active Clubs",
    value: "28",
    icon: <Building className="w-5 h-5 text-primary" />,
    description: "Student organizations",
    trend: 10,
    color: "yellow"
  },
  {
    title: "System Health",
    value: "98%",
    icon: <Activity className="w-5 h-5 text-primary" />,
    description: "Platform performance",
    trend: 2,
    color: "green"
  }
];

const PublicationsChart = () => {
  const [yearRange, setYearRange] = useState("5");
  const publicationData = [
    { year: '2020', papers: 45, citations: 120, impactFactor: 3.2 },
    { year: '2021', papers: 52, citations: 150, impactFactor: 3.5 },
    { year: '2022', papers: 58, citations: 180, impactFactor: 3.8 },
    { year: '2023', papers: 65, citations: 220, impactFactor: 4.1 },
    { year: '2024', papers: 70, citations: 250, impactFactor: 4.3 },
  ];

  return (
    <ChartContainer
      title="Research Impact Analytics"
      description="Track publication metrics and citation impact"
      filename="publications"
    >
      <div className="mb-4">
        <Select value={yearRange} onValueChange={setYearRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Year range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 years</SelectItem>
            <SelectItem value="5">Last 5 years</SelectItem>
            <SelectItem value="10">Last 10 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={publicationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="papers" fill="#0088FE" />
            <Line yAxisId="right" type="monotone" dataKey="citations" stroke="#00C49F" />
            <Line yAxisId="right" type="monotone" dataKey="impactFactor" stroke="#FFBB28" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />
        
        <TabNavigation>
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserActivityChart />
              {/* Add other charts here */}
            </div>
          </TabsContent>
          
          <TabsContent value="users">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserActivityChart />
            <div className="grid grid-cols-1 gap-6">
              <UserApproval />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clubs">
          <ClubManagement />
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectsChart />
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Research', value: 35 },
                            { name: 'Development', value: 25 },
                            { name: 'Analysis', value: 20 },
                            { name: 'Testing', value: 15 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: 'Research', value: 35 },
                            { name: 'Development', value: 25 },
                            { name: 'Analysis', value: 20 },
                            { name: 'Testing', value: 15 },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="publications">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PublicationsChart />
            <PaperReview />
          </div>
        </TabsContent>

        <TabsContent value="approvals">
          <div className="space-y-6">
            <UserApproval />
            <PaperReview />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
              <CardDescription>Configure your dashboard preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notifications</h3>
                    <p className="text-sm text-muted-foreground">Configure notification preferences</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Data Export</h3>
                    <p className="text-sm text-muted-foreground">Manage export settings</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">User Permissions</h3>
                    <p className="text-sm text-muted-foreground">Manage role permissions</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">API Access</h3>
                    <p className="text-sm text-muted-foreground">Manage API keys and access</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        </TabNavigation>
      </div>
    </div>
  );
}

export default dashboard;