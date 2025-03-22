import { useState } from 'react';
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { Search, Plus, Filter } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  owner: {
    name: string;
    role: 'student' | 'faculty';
  };
  status: 'ongoing' | 'completed' | 'dropped';
  startDate: string;
  department: string;
}

const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'AI-Powered Learning Assistant',
    description: 'Developing an AI system to assist students in personalized learning',
    owner: { name: 'Dr. Sarah Chen', role: 'faculty' },
    status: 'ongoing',
    startDate: '2024-01-15',
    department: 'Computer Science'
  },
  {
    id: '2',
    name: 'Renewable Energy Storage Solutions',
    description: 'Research on efficient energy storage systems for renewable sources',
    owner: { name: 'Prof. James Wilson', role: 'faculty' },
    status: 'completed',
    startDate: '2023-08-20',
    department: 'Physics'
  },
  {
    id: '3',
    name: 'Smart Campus Navigation System',
    description: 'Mobile app for campus navigation using IoT sensors',
    owner: { name: 'Alice Johnson', role: 'student' },
    status: 'ongoing',
    startDate: '2024-02-01',
    department: 'Computer Science'
  },
  {
    id: '4',
    name: 'Biodegradable Plastics Research',
    description: 'Development of eco-friendly plastic alternatives',
    owner: { name: 'Dr. Emily Brown', role: 'faculty' },
    status: 'dropped',
    startDate: '2023-11-10',
    department: 'Chemistry'
  },
  {
    id: '5',
    name: 'Mental Health Support Platform',
    description: 'Web platform for student mental health resources',
    owner: { name: 'Bob Wilson', role: 'student' },
    status: 'completed',
    startDate: '2023-09-05',
    department: 'Computer Science'
  }
];

// Analytics Data
const statusDistributionData = [
  { name: 'Ongoing', value: 45 },
  { name: 'Completed', value: 35 },
  { name: 'Dropped', value: 20 }
];

const projectsByDepartment = [
  { department: 'Computer Science', count: 28 },
  { department: 'Physics', count: 15 },
  { department: 'Chemistry', count: 12 },
  { department: 'Biology', count: 10 },
  { department: 'Mathematics', count: 8 }
];

const monthlyProgress = [
  { month: 'Jan', completed: 5, ongoing: 15, dropped: 2 },
  { month: 'Feb', completed: 7, ongoing: 18, dropped: 3 },
  { month: 'Mar', completed: 10, ongoing: 20, dropped: 2 },
  { month: 'Apr', completed: 12, ongoing: 22, dropped: 4 },
  { month: 'May', completed: 15, ongoing: 25, dropped: 5 }
];

const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

const ProjectsTab = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = sampleProjects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.owner.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesOwner = ownerFilter === 'all' || project.owner.role === ownerFilter;

    return matchesSearch && matchesStatus && matchesOwner;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <AdminNavbar />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Project Management</h1>
            <p className="text-muted-foreground">Track and manage research projects</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Status Distribution</CardTitle>
              <CardDescription>Overview of project completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects by Department</CardTitle>
              <CardDescription>Distribution across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectsByDepartment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
              <CardDescription>Project status trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="#00C49F" />
                    <Line type="monotone" dataKey="ongoing" stroke="#0088FE" />
                    <Line type="monotone" dataKey="dropped" stroke="#FF8042" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="dropped">Dropped</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Owner Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Department</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No projects found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{project.owner.name}</span>
                            <span className="text-sm text-muted-foreground capitalize">
                              {project.owner.role}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{project.department}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      {isMobile && <AdminMobileBottomNav />}
    </div>
  );
};

export default ProjectsTab;