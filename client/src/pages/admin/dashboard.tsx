import React, { useState } from 'react';
import { motion } from "framer-motion";
import {
  Users, FileText, Settings, Activity, Shield, BookOpen,
  Plus, Upload, FormInput, Send, Folder, File, ChevronDown
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

// Monthly student engagement data
const engagementData = [
  { month: 'Jan', workshops: 45, research: 32, events: 28 },
  { month: 'Feb', workshops: 50, research: 35, events: 25 },
  { month: 'Mar', workshops: 35, research: 40, events: 30 },
  { month: 'Apr', workshops: 55, research: 45, events: 35 },
  { month: 'May', workshops: 60, research: 50, events: 40 },
];

// Faculty distribution data
const facultyData = [
  { name: 'Engineering', value: 30 },
  { name: 'Sciences', value: 25 },
  { name: 'Arts', value: 20 },
  { name: 'Business', value: 15 },
  { name: 'Medicine', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-6 bg-card rounded-xl shadow-sm border"
  >
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-foreground/80">{title}</h3>
      <div className="p-2 bg-primary/10 rounded-full">
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold mt-4 text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground mt-2">{description}</p>
  </motion.div>
);

const FileUploadDialog = () => (
  <Dialog>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Upload Past Data</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Input type="text" placeholder="Folder name" />
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop files here or click to browse
            </p>
          </div>
        </div>
      </div>
      <Button className="w-full">Upload Files</Button>
    </DialogContent>
  </Dialog>
);

const NewDataFormDialog = () => (
  <Dialog>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New Data</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Input type="text" placeholder="Form Title" />
          <div className="space-y-2">
            <Input type="text" placeholder="Field name" />
            <Input type="text" placeholder="Field value" />
          </div>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Field
          </Button>
        </div>
      </div>
      <Button className="w-full">Save Data</Button>
    </DialogContent>
  </Dialog>
);

const NewPostDialog = () => (
  <Dialog>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Post</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input type="text" placeholder="Title" />
        <textarea
          className="min-h-[100px] rounded-md border p-3"
          placeholder="Write your post content..."
        />
      </div>
      <Button className="w-full">Publish Post</Button>
    </DialogContent>
  </Dialog>
);


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDialog, setSelectedDialog] = useState<string | null>(null);

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: <Users className="w-5 h-5 text-primary" />,
      description: "Active users across all roles"
    },
    {
      title: "Research Projects",
      value: "45",
      icon: <FileText className="w-5 h-5 text-primary" />,
      description: "Ongoing research initiatives"
    },
    {
      title: "Faculty Members",
      value: "89",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      description: "Active teaching staff"
    },
    {
      title: "System Health",
      value: "98%",
      icon: <Activity className="w-5 h-5 text-primary" />,
      description: "Platform performance status"
    },
    {
      title: "Security Alerts",
      value: "0",
      icon: <Shield className="w-5 h-5 text-primary" />,
      description: "No active security issues"
    },
    {
      title: "System Settings",
      value: "7",
      icon: <Settings className="w-5 h-5 text-primary" />,
      description: "Pending configuration updates"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage platform activities
          </p>
        </motion.div>

        <div className="mt-4 md:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setSelectedDialog("upload")}>
                <Upload className="mr-2 h-4 w-4" /> Upload Past Data
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSelectedDialog("newData")}>
                <FormInput className="mr-2 h-4 w-4" /> Add New Data
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSelectedDialog("post")}>
                <Send className="mr-2 h-4 w-4" /> Make a Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Upload Past Data Dialog */}
          <Dialog open={selectedDialog === "upload"} onOpenChange={() => setSelectedDialog(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Past Data</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Input type="text" placeholder="Folder name" />
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop files here or click to browse
                    </p>
                  </div>
                </div>
              </div>
              <Button className="w-full">Upload Files</Button>
            </DialogContent>
          </Dialog>

          {/* Add New Data Dialog */}
          <Dialog open={selectedDialog === "newData"} onOpenChange={() => setSelectedDialog(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Data</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Input type="text" placeholder="Form Title" />
                  <div className="space-y-2">
                    <Input type="text" placeholder="Field name" />
                    <Input type="text" placeholder="Field value" />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Field
                  </Button>
                </div>
              </div>
              <Button className="w-full">Save Data</Button>
            </DialogContent>
          </Dialog>

          {/* Make a Post Dialog */}
          <Dialog open={selectedDialog === "post"} onOpenChange={() => setSelectedDialog(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input type="text" placeholder="Title" />
                <textarea
                  className="min-h-[100px] rounded-md border p-3"
                  placeholder="Write your post content..."
                />
              </div>
              <Button className="w-full">Publish Post</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="workshops" fill="#0088FE" />
                      <Bar dataKey="research" fill="#00C49F" />
                      <Bar dataKey="events" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Faculty Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={facultyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {facultyData.map((entry, index) => (
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
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>File Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> New Folder
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" /> Upload Files
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center p-2 hover:bg-accent rounded-lg">
                    <Folder className="h-4 w-4 mr-2" />
                    <span>Research Papers</span>
                  </div>
                  <div className="flex items-center p-2 hover:bg-accent rounded-lg">
                    <Folder className="h-4 w-4 mr-2" />
                    <span>Course Materials</span>
                  </div>
                  <div className="flex items-center p-2 hover:bg-accent rounded-lg">
                    <Folder className="h-4 w-4 mr-2" />
                    <span>Administrative Documents</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}