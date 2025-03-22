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
import { Search, Plus, Filter, Users, Calendar, TrendingUp, Award } from 'lucide-react';
import { motion } from "framer-motion";

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

  // Add animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16 md:pb-0">
      <AdminNavbar />
      <motion.div 
        className="p-6 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Project Management
          </h1>
          <p className="text-muted-foreground mt-2">Track and manage research projects</p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Total Projects
                    </p>
                    <h3 className="text-3xl font-bold mt-2">{sampleProjects.length}</h3>
                    <p className="text-sm opacity-80 mt-1">Last 30 days: +3</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Ongoing Projects
                    </p>
                    <h3 className="text-3xl font-bold mt-2">{sampleProjects.filter(p => p.status === 'ongoing').length}</h3>
                    <p className="text-sm opacity-80 mt-1">Last 30 days: +2</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Completed Projects
                    </p>
                    <h3 className="text-3xl font-bold mt-2">{sampleProjects.filter(p => p.status === 'completed').length}</h3>
                    <p className="text-sm opacity-80 mt-1">Last 30 days: +1</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-semibold">Project Status Distribution</CardTitle>
                <CardDescription>Overview of project completion status</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
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
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: 'none',
                          borderRadius: '4px',
                          color: 'white'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-semibold">Projects by Department</CardTitle>
                <CardDescription>Distribution across departments</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectsByDepartment}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="department" 
                        angle={-45} 
                        textAnchor="end" 
                        height={100}
                        tick={{ fill: '#666' }}
                      />
                      <YAxis tick={{ fill: '#666' }} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: 'none',
                          borderRadius: '4px',
                          color: 'white'
                        }}
                      />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

         
        </motion.div>

        {/* Projects Table */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/50">
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
                    <SelectTrigger className="w-[140px] focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/50">
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
                        <TableRow 
                          key={project.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
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
        </motion.div>
      </motion.div>
      {isMobile && <AdminMobileBottomNav />}
    </div>
  );
};

export default ProjectsTab;