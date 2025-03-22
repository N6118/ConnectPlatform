import { useState } from 'react';
import AdminNavbar from '@/components/navigation/AdminNavbar';
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Plus, Edit, Trash2, UserPlus, Search, AlertCircle, Users, UserCog, GraduationCap, Building2, Pencil } from 'lucide-react';
import { UserActivityChart } from '@/components/UserActivityChart';
import { UserApproval } from '../../components/UserApproval';
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Types for different user roles
interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface AdminUser extends BaseUser {
  role: 'admin';
}

interface FacultyUser extends BaseUser {
  role: 'faculty';
}

interface StudentUser extends BaseUser {
  role: 'student';
  rollNo: string;
  year: number;
}

type User = AdminUser | FacultyUser | StudentUser;

// Available departments
const departments = [
  'Computer Science',
  'Physics',
  'Mathematics',
  'Chemistry',
  'Biology',
  'Electrical Engineering',
  'Mechanical Engineering'
];

// Sample data
const sampleUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john@admin.edu', role: 'admin', department: 'Computer Science' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@admin.edu', role: 'admin', department: 'Physics' },
  { id: '3', name: 'Dr. James Wilson', email: 'james@faculty.edu', role: 'faculty', department: 'Computer Science' },
  { id: '4', name: 'Dr. Emily Brown', email: 'emily@faculty.edu', role: 'faculty', department: 'Physics' },
  { id: '5', name: 'Alice Johnson', email: 'alice@student.edu', role: 'student', department: 'Computer Science', rollNo: 'CS2021001', year: 3 },
  { id: '6', name: 'Bob Wilson', email: 'bob@student.edu', role: 'student', department: 'Physics', rollNo: 'PH2021002', year: 2 },
];

// Analytics data
const departmentData = [
  { name: 'Computer Science', value: 45 },
  { name: 'Physics', value: 30 },
  { name: 'Electrical Engineering', value: 18 },
  { name: 'Mechanical Engineering', value: 22 },
];

const yearWiseData = [
  { year: '1st Year', students: 150 },
  { year: '2nd Year', students: 120 },
  { year: '3rd Year', students: 100 },
  { year: '4th Year', students: 90 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export const UsersTab = () => {
  const isMobile = useIsMobile();
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'faculty' | 'student'>('admin');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    setIsDeleteDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const confirmDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const filteredUsers = (role: 'admin' | 'faculty' | 'student') => {
    return users
      .filter(user => user.role === role)
      .filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.role === 'student' && (user as StudentUser).rollNo.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  };

  const UserTable = ({ role }: { role: 'admin' | 'faculty' | 'student' }) => {
    const filtered = filteredUsers(role);

    return (
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${role}s...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button 
            onClick={() => {
              setSelectedRole(role);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add {role}</span>
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No {role}s found
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((user) => (
              <Card key={user.id} className="overflow-hidden group hover:shadow-lg transition-all duration-200 border border-transparent hover:border-primary/20">
                <CardHeader 
                  className="p-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100/80 transition-colors" 
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">{user.name}</CardTitle>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <span>{user.email}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">{user.department}</Badge>
                        </span>
                        {user.role === 'student' && (
                          <>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">
                              {(user as StudentUser).rollNo}
                            </Badge>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">
                              Year {(user as StudentUser).year}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleEditUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => confirmDelete(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const CreateUserForm = ({ role }: { role: 'admin' | 'faculty' | 'student' }) => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter full name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter email address" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="department">Department</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept.toLowerCase().replace(/\s+/g, '-')}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {role === 'student' && (
        <>
          <div className="grid gap-2">
            <Label htmlFor="rollNo">Roll Number</Label>
            <Input id="rollNo" placeholder="Enter roll number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );

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
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage users, roles, and permissions</p>
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
                      <Users className="h-4 w-4" />
                      Total Users
                    </p>
                    <h3 className="text-3xl font-bold mt-2">{users.length}</h3>
                    <p className="text-sm opacity-80 mt-1">Last 30 days: +5</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-full">
                    <Users className="h-6 w-6" />
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
                      <UserCog className="h-4 w-4" />
                      Administrators
                    </p>
                    <h3 className="text-3xl font-bold mt-2">{users.filter(u => u.role === 'admin').length}</h3>
                    <p className="text-sm opacity-80 mt-1">Last 30 days: +1</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-full">
                    <UserCog className="h-6 w-6" />
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
                      <Building2 className="h-4 w-4" />
                      Faculty Members
                    </p>
                    <h3 className="text-3xl font-bold mt-2">{users.filter(u => u.role === 'faculty').length}</h3>
                    <p className="text-sm opacity-80 mt-1">Last 30 days: +2</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-full">
                    <Building2 className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Students
                    </p>
                    <h3 className="text-3xl font-bold mt-2">{users.filter(u => u.role === 'student').length}</h3>
                    <p className="text-sm opacity-80 mt-1">Last 30 days: +3</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-full">
                    <GraduationCap className="h-6 w-6" />
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
                <CardTitle className="text-xl font-semibold">Department Distribution</CardTitle>
                <CardDescription>Users across different departments</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {departmentData.map((entry, index) => (
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
                <CardTitle className="text-xl font-semibold">Student Year Distribution</CardTitle>
                <CardDescription>Students across different years</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearWiseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: 'none',
                          borderRadius: '4px',
                          color: 'white'
                        }}
                      />
                      <Bar dataKey="students" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* User Tables */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              <Tabs defaultValue="admin" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger 
                    value="admin" 
                    className="flex-1 min-w-[100px] md:flex-none data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                  >
                    Administrators
                  </TabsTrigger>
                  <TabsTrigger 
                    value="faculty" 
                    className="flex-1 min-w-[100px] md:flex-none data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                  >
                    Faculty
                  </TabsTrigger>
                  <TabsTrigger 
                    value="student" 
                    className="flex-1 min-w-[100px] md:flex-none data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                  >
                    Students
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="admin" className="mt-6">
                  <UserTable role="admin" />
                </TabsContent>
                <TabsContent value="faculty" className="mt-6">
                  <UserTable role="faculty" />
                </TabsContent>
                <TabsContent value="student" className="mt-6">
                  <UserTable role="student" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create User Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</DialogTitle>
              <DialogDescription>
                Add a new {selectedRole} to the system. Fill in all required information.
              </DialogDescription>
            </DialogHeader>
            <CreateUserForm role={selectedRole} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateModalOpen(false)}>Create {selectedRole}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Modify user information. All fields are required.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input id="edit-name" defaultValue={selectedUser.name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedUser.email} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Select defaultValue={selectedUser.department.toLowerCase().replace(/\s+/g, '-')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept.toLowerCase().replace(/\s+/g, '-')}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedUser.role === 'student' && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-rollno">Roll Number</Label>
                      <Input id="edit-rollno" defaultValue={(selectedUser as StudentUser).rollNo} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-year">Year</Label>
                      <Select defaultValue={(selectedUser as StudentUser).year.toString()}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditModalOpen(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user
                {selectedUser && (
                  <span className="font-medium"> {selectedUser.name}</span>
                )} and remove their data from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
      {isMobile && <AdminMobileBottomNav />}
    </div>
  );
};

export default UsersTab;