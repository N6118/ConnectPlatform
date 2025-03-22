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
import { Plus, Edit, Trash2, UserPlus, Search, AlertCircle } from 'lucide-react';
import { UserActivityChart } from '@/components/UserActivityChart';
import { UserApproval } from '../../components/UserApproval';

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
  { name: 'Mathematics', value: 25 },
  { name: 'Chemistry', value: 20 },
  { name: 'Biology', value: 15 },
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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                {role === 'student' && (
                  <>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Year</TableHead>
                  </>
                )}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={role === 'student' ? 6 : 4} className="text-center text-muted-foreground">
                    No {role}s found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    {role === 'student' && user.role === 'student' && (
                      <>
                        <TableCell>{user.rollNo}</TableCell>
                        <TableCell>{user.year}</TableCell>
                      </>
                    )}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete(user)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <AdminNavbar />
      <div className="px-8 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage users, roles, and permissions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Users across different departments</CardDescription>
            </CardHeader>
            <CardContent>
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
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Year Distribution</CardTitle>
              <CardDescription>Students across different years</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearWiseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>


        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="admin">Administrators</TabsTrigger>
                <TabsTrigger value="faculty">Faculty</TabsTrigger>
                <TabsTrigger value="student">Students</TabsTrigger>
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
      </div>
      {isMobile && <AdminMobileBottomNav />}
    </div>
  );
};

export default UsersTab;