import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminNavbar from '@/components/navigation/AdminNavbar';
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Sample data
const projectData = [
  { name: 'Research', value: 35 },
  { name: 'Development', value: 25 },
  { name: 'Analysis', value: 20 },
  { name: 'Testing', value: 15 },
];

const projectStatusData = [
  { year: '2020', ongoing: 45, completed: 30 },
  { year: '2021', ongoing: 50, completed: 35 },
  { year: '2022', ongoing: 35, completed: 45 },
  { year: '2023', ongoing: 40, completed: 50 },
  { year: '2024', ongoing: 55, completed: 40 },
];

const approvalRateData = [
  { year: '2020', approved: 85, rejected: 15 },
  { year: '2021', approved: 88, rejected: 12 },
  { year: '2022', approved: 92, rejected: 8 },
  { year: '2023', approved: 90, rejected: 10 },
  { year: '2024', approved: 94, rejected: 6 },
];

const mentorData = [
  { name: 'Dr. Smith', projects: 25 },
  { name: 'Dr. Johnson', projects: 22 },
  { name: 'Prof. Williams', projects: 20 },
  { name: 'Dr. Brown', projects: 18 },
  { name: 'Prof. Davis', projects: 15 },
];

const completionTimeData = [
  { year: '2020', months: 8.5 },
  { year: '2021', months: 7.8 },
  { year: '2022', months: 7.2 },
  { year: '2023', months: 6.9 },
  { year: '2024', months: 6.5 },
];

export const ProjectsTab = () => {
  const isMobile = useIsMobile();
  const [selectedYear, setSelectedYear] = useState('2024');

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <AdminNavbar />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Project Analytics Dashboard</h1>
          <div className="mt-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {['2020', '2021', '2022', '2023', '2024'].map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Project Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {projectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Ongoing vs Completed Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Project Status by Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ongoing" stackId="a" fill="#0088FE" name="Ongoing" />
                    <Bar dataKey="completed" stackId="a" fill="#00C49F" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Faculty Mentors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Faculty Mentors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mentorData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="projects" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Average Completion Time */}
          <Card>
            <CardHeader>
              <CardTitle>Average Time to Completion (Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={completionTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="months" stroke="#FF8042" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {isMobile && <AdminMobileBottomNav />}
    </div>
  );
};

export default ProjectsTab;