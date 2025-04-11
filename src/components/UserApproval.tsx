import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Calendar, FileClock, User, Building, Mail } from "lucide-react";

interface PendingUser {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const initialUsers: PendingUser[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@university.edu',
    role: 'Student',
    department: 'Computer Science',
    requestDate: '2024-02-15',
    status: 'pending'
  },
  {
    id: 2,
    name: 'Dr. Sarah Williams',
    email: 'sarah.williams@university.edu',
    role: 'Faculty',
    department: 'Physics',
    requestDate: '2024-02-16',
    status: 'pending'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.b@university.edu',
    role: 'Student',
    department: 'Mechanical Engineering',
    requestDate: '2024-02-16',
    status: 'pending'
  }
];

export const UserApproval = () => {
  const [users, setUsers] = useState<PendingUser[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const handleAction = (user: PendingUser, action: 'approve' | 'reject') => {
    setSelectedUser(user);
    setActionType(action);
    setDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedUser || !actionType) return;

    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === selectedUser.id
          ? { ...user, status: actionType === 'approve' ? 'approved' : 'rejected' }
          : user
      )
    );

    // toast({
    //   title: actionType === 'approve' ? 'User Approved' : 'User Rejected',
    //   description: `${selectedUser.name}'s account has been ${actionType === 'approve' ? 'approved' : 'rejected'}.`,
    //   duration: 3000,
    // });

    setDialogOpen(false);
    setSelectedUser(null);
    setActionType(null);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return statusStyles[status as keyof typeof statusStyles] || statusStyles.pending;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pending User Approvals</CardTitle>
            <CardDescription>Review and manage new user registration requests</CardDescription>
          </div>
          <Badge variant="secondary" className="h-7">
            {users.filter(user => user.status === 'pending').length} Pending
          </Badge>
        </div>
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {user.department}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {user.requestDate}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(user.status)}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {user.status === 'pending' && (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-50 hover:bg-green-100 text-green-700"
                        onClick={() => handleAction(user, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 hover:bg-red-100 text-red-700"
                        onClick={() => handleAction(user, 'reject')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve' ? 'Approve User' : 'Reject User'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'approve'
                  ? 'Are you sure you want to approve this user? They will be granted access to the platform.'
                  : 'Are you sure you want to reject this user? This action cannot be undone.'}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{selectedUser.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileClock className="h-4 w-4" />
                  <span>Requested on {selectedUser.requestDate}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'approve' ? 'default' : 'destructive'}
                onClick={confirmAction}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserApproval;