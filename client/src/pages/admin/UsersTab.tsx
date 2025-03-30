import { useState, useEffect } from 'react';
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
import { api } from '@/services/api';
import { profileService } from '@/services/profile';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';

// Types for different user roles
interface SocialLinks {
  github: string;
  linkedin: string;
  portfolio: string;
}

interface StudentDetails {
  enrollmentNumber: string;
  branch: string;
  course: string;
  college: string;
  semester: string;
  graduationYear: string;
  section: string;
}

interface FacultyDetails {
  employeeId: string;
  department: string;
  designation: string;
  specialization: string;
  qualification: string;
}

interface ClubMembership {
  clubId: number;
  clubName: string;
  rollNo: string;
  role: string;
  userName: string;
}

interface User {
  id: number;
  username: string;
  about: string;
  email: string;
  name: string;
  profilePicture: string | null;
  headline: string;
  role: string;
  post: any;
  socialLinks: SocialLinks;
  studentDetails?: StudentDetails;
  facultyDetails?: FacultyDetails;
  achievement: string[];
  interest: string[];
  clubMemberships: ClubMembership[];
  active: boolean;
}

interface ApiResponse {
  data: User[];
  message: string;
  count: number;
}

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

export const UsersTab = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'FACULTY' | 'STUDENT'>('ADMIN');
  const [searchQuery, setSearchQuery] = useState('');
  const [editFormData, setEditFormData] = useState<any>({});
  const [createFormData, setCreateFormData] = useState<any>({
    name: '',
    email: '',
    username: '',
    password: '',
    role: '',
    about: '',
    headline: '',
    socialLinks: {
      github: '',
      linkedin: '',
      portfolio: ''
    }
  });
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('search/users');
      console.log('API Response:', response);
      
      if (response.success) {
        // Extract actual data from nested response
        if (response.data && Array.isArray(response.data.data)) {
          console.log('Users data array found:', response.data.data);
          setUsers(response.data.data);
        } else if (Array.isArray(response.data)) {
          console.log('Users array found directly:', response.data);
          setUsers(response.data);
        } else {
          console.warn('Unexpected response format:', response.data);
          setUsers([]);
        }
      } else {
        throw new Error(response.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
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

  const handleDeleteUser = async (username: string) => {
    try {
      // Ensure the path matches the exact endpoint structure
      const response = await api.delete(`user/deleteUser/${username}`);
      console.log('Delete response:', response); // Debug - remove after confirming
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });
        fetchUsers(); // Refresh the user list
      } else {
        throw new Error(response.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
    setIsDeleteDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      about: user.about,
      headline: user.headline,
      socialLinks: {
        github: user.socialLinks.github || '',
        linkedin: user.socialLinks.linkedin || '',
        portfolio: user.socialLinks.portfolio || '',
      },
      // Include role-specific details if they exist
      ...(user.role === 'STUDENT' && user.studentDetails ? {
        enrollmentNumber: user.studentDetails.enrollmentNumber,
        branch: user.studentDetails.branch,
        course: user.studentDetails.course,
        college: user.studentDetails.college,
        semester: user.studentDetails.semester,
        graduationYear: user.studentDetails.graduationYear,
        section: user.studentDetails.section,
      } : {}),
      ...(user.role === 'FACULTY' && user.facultyDetails ? {
        employeeId: user.facultyDetails.employeeId,
        department: user.facultyDetails.department,
        designation: user.facultyDetails.designation,
        specialization: user.facultyDetails.specialization,
        qualification: user.facultyDetails.qualification,
      } : {}),
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    
    try {
      const updatedUser = {
        name: editFormData.name,
        email: editFormData.email,
        about: editFormData.about,
        headline: editFormData.headline,
        socialLinks: editFormData.socialLinks,
        // Add role-specific details based on user role
        ...(selectedUser.role === 'STUDENT' ? {
          studentDetails: {
            enrollmentNumber: editFormData.enrollmentNumber,
            branch: editFormData.branch,
            course: editFormData.course,
            college: editFormData.college,
            semester: editFormData.semester,
            graduationYear: editFormData.graduationYear,
            section: editFormData.section,
          }
        } : {}),
        ...(selectedUser.role === 'FACULTY' ? {
          facultyDetails: {
            employeeId: editFormData.employeeId,
            department: editFormData.department,
            designation: editFormData.designation,
            specialization: editFormData.specialization,
            qualification: editFormData.qualification,
          }
        } : {}),
      };

      // Use direct api.patch instead of profileService to ensure we have the right endpoint
      const response = await api.patch(`user/${selectedUser.username}`, updatedUser);
      console.log('Update response:', response); // Debug - remove after confirming
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
        fetchUsers(); // Refresh the user list
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    }
  };

  const confirmDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties (socialLinks)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditFormData({
        ...editFormData,
        [parent]: {
          ...editFormData[parent],
          [child]: value
        }
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCreateFormData({
        ...createFormData,
        [parent]: {
          ...createFormData[parent],
          [child]: value
        }
      });
    } else {
      setCreateFormData({
        ...createFormData,
        [name]: value
      });
    }
  };

  const handleCreateUser = async () => {
    try {
      // Set role from the selected tab
      const userData = {
        ...createFormData,
        role: selectedRole,
        // Add role-specific details
        ...(selectedRole === 'STUDENT' ? {
          studentDetails: {
            enrollmentNumber: createFormData.enrollmentNumber || '',
            branch: createFormData.branch || '',
            course: createFormData.course || '',
            college: createFormData.college || '',
            semester: createFormData.semester || '',
            graduationYear: createFormData.graduationYear || '',
            section: createFormData.section || ''
          }
        } : {}),
        ...(selectedRole === 'FACULTY' ? {
          facultyDetails: {
            employeeId: createFormData.employeeId || '',
            department: createFormData.department || '',
            designation: createFormData.designation || '',
            specialization: createFormData.specialization || '',
            qualification: createFormData.qualification || ''
          }
        } : {})
      };

      console.log('Creating new user:', userData);
      
      const response = await api.post('user/register', userData);
      console.log('Create response:', response);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
        fetchUsers(); // Refresh the user list
        setIsCreateModalOpen(false);
        // Reset form
        setCreateFormData({
          name: '',
          email: '',
          username: '',
          password: '',
          role: '',
          about: '',
          headline: '',
          socialLinks: {
            github: '',
            linkedin: '',
            portfolio: ''
          }
        });
      } else {
        throw new Error(response.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
    }
  };

  // Add a function to get normalized role from user
  const getNormalizedRole = (user: User): 'ADMIN' | 'FACULTY' | 'STUDENT' | string => {
    if (!user.role) return '';
    return user.role.toUpperCase() as 'ADMIN' | 'FACULTY' | 'STUDENT';
  };

  // Update the filteredUsers function to handle any role format
  const filteredUsers = (role: 'ADMIN' | 'FACULTY' | 'STUDENT') => {
    if (!users || users.length === 0) {
      return [];
    }
    
    console.log(`Filtering for role: ${role}, Total users:`, users.length);
    
    // First check if any users exist with this role, without case sensitivity
    const roleUsers = users.filter(user => {
      const normalizedRole = getNormalizedRole(user);
      const matchesRole = normalizedRole === role;
      
      if (matchesRole) {
        console.log(`User with matching role: ${user.username}, role: ${user.role}, normalized: ${normalizedRole}`);
      }
      return matchesRole;
    });
    
    console.log(`Found ${roleUsers.length} users with role ${role}`);
    
    // Then apply the search filter
    const filtered = roleUsers.filter(user => 
      !searchQuery || // If no search query, include all
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.studentDetails?.enrollmentNumber?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.facultyDetails?.department?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
      
    console.log(`After search filter, found ${filtered.length} users with role ${role}`);
    return filtered;
  };

  // Prepare analytics data based on actual user data
  const getDepartmentData = () => {
    const departmentCounts: Record<string, number> = {};
    
    if (!users || users.length === 0) {
      return [];
    }
    
    users.forEach(user => {
      let department = '';
      
      if (user.role === 'STUDENT' && user.studentDetails) {
        department = user.studentDetails.branch;
      } else if (user.role === 'FACULTY' && user.facultyDetails) {
        department = user.facultyDetails.department;
      }
      
      if (department) {
        departmentCounts[department] = (departmentCounts[department] || 0) + 1;
      }
    });
    
    return Object.entries(departmentCounts).map(([name, value]) => ({ name, value }));
  };

  const getYearWiseData = () => {
    const yearCounts: Record<string, number> = {};
    
    if (!users || users.length === 0) {
      return [];
    }
    
    users.forEach(user => {
      if (user.role === 'STUDENT' && user.studentDetails?.graduationYear) {
        const year = user.studentDetails.graduationYear;
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    });
    
    return Object.entries(yearCounts)
      .map(([year, students]) => ({ year, students }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  };

  // Only compute analytics data when not loading
  const departmentData = !isLoading ? getDepartmentData() : [];
  const yearWiseData = !isLoading ? getYearWiseData() : [];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  // Add helper functions to count users by normalized role
  const countUsersByRole = (role: 'ADMIN' | 'FACULTY' | 'STUDENT') => {
    if (!users) return 0;
    return users.filter(user => getNormalizedRole(user) === role).length;
  };

  const UserTable = ({ role }: { role: 'ADMIN' | 'FACULTY' | 'STUDENT' }) => {
    const filtered = filteredUsers(role);
    console.log(`UserTable for role ${role}, filtered users count: ${filtered.length}`);

    // Log the first user in detail to understand structure
    if (filtered.length > 0) {
      console.log('Sample user structure:', JSON.stringify(filtered[0], null, 2));
    }

    return (
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${role.toLowerCase()}s...`}
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
            <span>Add {role.toLowerCase()}</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No {role.toLowerCase()}s found
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((user) => {
              // Get the normalized role for this user
              const normalizedRole = getNormalizedRole(user);
              return (
                <Card key={user.id} className="overflow-hidden group hover:shadow-lg transition-all duration-200 border border-transparent hover:border-primary/20">
                  <CardHeader 
                    className="p-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100/80 transition-colors" 
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">
                          {user.name || 'Unknown Name'}
                        </CardTitle>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1">
                            <span>{user.email || 'No email'}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">@{user.username || 'unknown'}</Badge>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">{user.role}</Badge>
                          </span>
                          {/* Only show student details if they exist */}
                          {normalizedRole === 'STUDENT' && user.studentDetails && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs">
                                {user.studentDetails.enrollmentNumber || 'No enrollment #'}
                              </Badge>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs">
                                {user.studentDetails.branch || 'No branch'}
                              </Badge>
                            </>
                          )}
                          {/* Only show faculty details if they exist */}
                          {normalizedRole === 'FACULTY' && user.facultyDetails && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs">
                                {user.facultyDetails.designation || 'No designation'}
                              </Badge>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs">
                                {user.facultyDetails.department || 'No department'}
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
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const CreateUserForm = ({ role }: { role: 'ADMIN' | 'FACULTY' | 'STUDENT' }) => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username" 
          name="username"
          placeholder="Enter username" 
          value={createFormData.username}
          onChange={handleCreateInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          name="password"
          type="password" 
          placeholder="Enter password" 
          value={createFormData.password}
          onChange={handleCreateInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="create-name">Name</Label>
        <Input 
          id="create-name" 
          name="name"
          placeholder="Enter full name" 
          value={createFormData.name}
          onChange={handleCreateInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="create-email">Email</Label>
        <Input 
          id="create-email" 
          name="email"
          type="email" 
          placeholder="Enter email address" 
          value={createFormData.email}
          onChange={handleCreateInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="create-headline">Headline</Label>
        <Input 
          id="create-headline" 
          name="headline"
          placeholder="Enter headline" 
          value={createFormData.headline}
          onChange={handleCreateInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="create-about">About</Label>
        <Textarea 
          id="create-about" 
          name="about"
          placeholder="Enter about information"
          rows={3}
          value={createFormData.about}
          onChange={handleCreateInputChange}
        />
      </div>
      
      {role === 'STUDENT' && (
        <>
          <div className="grid gap-2">
            <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
            <Input 
              id="enrollmentNumber" 
              name="enrollmentNumber"
              placeholder="Enter enrollment number" 
              value={createFormData.enrollmentNumber || ''}
              onChange={handleCreateInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="branch">Branch</Label>
            <Input 
              id="branch" 
              name="branch"
              placeholder="Enter branch" 
              value={createFormData.branch || ''}
              onChange={handleCreateInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course">Course</Label>
            <Input 
              id="course" 
              name="course"
              placeholder="Enter course" 
              value={createFormData.course || ''}
              onChange={handleCreateInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="college">College</Label>
            <Input 
              id="college" 
              name="college"
              placeholder="Enter college name" 
              value={createFormData.college || ''}
              onChange={handleCreateInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="semester">Semester</Label>
            <Input 
              id="semester" 
              name="semester"
              placeholder="Enter current semester" 
              value={createFormData.semester || ''}
              onChange={handleCreateInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Input 
              id="graduationYear" 
              name="graduationYear"
              placeholder="Enter graduation year" 
              value={createFormData.graduationYear || ''}
              onChange={handleCreateInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="section">Section</Label>
            <Input 
              id="section" 
              name="section"
              placeholder="Enter section" 
              value={createFormData.section || ''}
              onChange={handleCreateInputChange}
            />
          </div>
        </>
      )}
      
      {role === 'FACULTY' && (
        <>
          <div className="grid gap-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input 
              id="employeeId" 
              name="employeeId"
              placeholder="Enter employee ID" 
              value={createFormData.employeeId || ''}
              onChange={handleCreateInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Input 
              id="department" 
              name="department"
              placeholder="Enter department" 
              value={createFormData.department || ''}
              onChange={handleCreateInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="designation">Designation</Label>
            <Input 
              id="designation" 
              name="designation"
              placeholder="Enter designation" 
              value={createFormData.designation || ''}
              onChange={handleCreateInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input 
              id="specialization" 
              name="specialization"
              placeholder="Enter specialization" 
              value={createFormData.specialization || ''}
              onChange={handleCreateInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input 
              id="qualification" 
              name="qualification"
              placeholder="Enter qualification" 
              value={createFormData.qualification || ''}
              onChange={handleCreateInputChange}
            />
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
                    <h3 className="text-3xl font-bold mt-2">{users?.length || 0}</h3>
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
                    <h3 className="text-3xl font-bold mt-2">{countUsersByRole('ADMIN')}</h3>
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
                    <h3 className="text-3xl font-bold mt-2">{countUsersByRole('FACULTY')}</h3>
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
                    <h3 className="text-3xl font-bold mt-2">{countUsersByRole('STUDENT')}</h3>
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
                <CardDescription>Students by graduation year</CardDescription>
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
              <Tabs defaultValue="ADMIN" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger 
                    value="ADMIN" 
                    className="flex-1 min-w-[100px] md:flex-none data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                  >
                    Administrators
                  </TabsTrigger>
                  <TabsTrigger 
                    value="FACULTY" 
                    className="flex-1 min-w-[100px] md:flex-none data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                  >
                    Faculty
                  </TabsTrigger>
                  <TabsTrigger 
                    value="STUDENT" 
                    className="flex-1 min-w-[100px] md:flex-none data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                  >
                    Students
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="ADMIN" className="mt-6">
                  <UserTable role="ADMIN" />
                </TabsContent>
                <TabsContent value="FACULTY" className="mt-6">
                  <UserTable role="FACULTY" />
                </TabsContent>
                <TabsContent value="STUDENT" className="mt-6">
                  <UserTable role="STUDENT" />
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
              <Button onClick={handleCreateUser}>Create {selectedRole.toLowerCase()}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Modify user information for {selectedUser?.username}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={editFormData.email || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input 
                    id="headline" 
                    name="headline"
                    value={editFormData.headline || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea 
                    id="about" 
                    name="about"
                    rows={3}
                    value={editFormData.about || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Social Links</Label>
                  <div className="space-y-2">
                    <Input 
                      id="github" 
                      name="socialLinks.github"
                      placeholder="GitHub URL"
                      value={editFormData.socialLinks?.github || ''}
                      onChange={handleInputChange}
                    />
                    <Input 
                      id="linkedin" 
                      name="socialLinks.linkedin"
                      placeholder="LinkedIn URL"
                      value={editFormData.socialLinks?.linkedin || ''}
                      onChange={handleInputChange}
                    />
                    <Input 
                      id="portfolio" 
                      name="socialLinks.portfolio"
                      placeholder="Portfolio URL"
                      value={editFormData.socialLinks?.portfolio || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                {selectedUser.role === 'STUDENT' && (
                  <div className="grid gap-4">
                    <h3 className="text-sm font-medium">Student Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                        <Input 
                          id="enrollmentNumber" 
                          name="enrollmentNumber"
                          value={editFormData.enrollmentNumber || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input 
                          id="branch" 
                          name="branch"
                          value={editFormData.branch || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="course">Course</Label>
                        <Input 
                          id="course" 
                          name="course"
                          value={editFormData.course || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="college">College</Label>
                        <Input 
                          id="college" 
                          name="college"
                          value={editFormData.college || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="semester">Semester</Label>
                        <Input 
                          id="semester" 
                          name="semester"
                          value={editFormData.semester || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Input 
                          id="graduationYear" 
                          name="graduationYear"
                          value={editFormData.graduationYear || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="section">Section</Label>
                        <Input 
                          id="section" 
                          name="section"
                          value={editFormData.section || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedUser.role === 'FACULTY' && (
                  <div className="grid gap-4">
                    <h3 className="text-sm font-medium">Faculty Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input 
                          id="employeeId" 
                          name="employeeId"
                          value={editFormData.employeeId || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="department">Department</Label>
                        <Input 
                          id="department" 
                          name="department"
                          value={editFormData.department || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input 
                          id="designation" 
                          name="designation"
                          value={editFormData.designation || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input 
                          id="specialization" 
                          name="specialization"
                          value={editFormData.specialization || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2 col-span-2">
                        <Label htmlFor="qualification">Qualification</Label>
                        <Input 
                          id="qualification" 
                          name="qualification"
                          value={editFormData.qualification || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
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
                  <span className="font-medium"> {selectedUser.name} (@{selectedUser.username})</span>
                )} and remove their data from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => selectedUser && handleDeleteUser(selectedUser.username)}
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