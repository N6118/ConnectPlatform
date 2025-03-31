import type { z } from 'zod';

export interface User {
  id: number;
  username: string;
  about: string;
  email: string;
  name: string;
  profilePicture: string | null;
  headline: string;
  role: "admin" | "faculty" | "student" | "ADMIN" | "FACULTY" | "STUDENT";
  post: any;
  socialLinks: {
    github: string;
    linkedin: string;
    portfolio: string;
  };
  studentDetails?: {
    enrollmentNumber: string;
    branch: string;
    course: string;
    college: string;
    semester: string;
    graduationYear: string;
    section: string;
    totalPerformanceScore: number | null;
    thresholdLevel: number | null;
    capacity: number | null;
    currentProjectPoints: number | null;
    easyCommitmentScore: number | null;
    mediumCommitmentScore: number | null;
    difficultCommitmentScore: number | null;
    skillPoints: Record<string, any>;
  };
  facultyDetails?: {
    employeeId: string;
    department: string;
    designation: string;
    specialization: string;
    qualification: string;
  };
  achievement: string[];
  interest: string[];
  clubMemberships: {
    clubId: number | null;
    clubName: string | null;
    rollNo: string;
    role: string;
    userName: string | null;
  }[];
  active: boolean;
}

// Sample users for testing
export const sampleUsers: User[] = [
  {
    username: "admin@connect.edu",
    password: "Admin@123",
    role: "admin",
    name: "Admin User"
  },
  {
    username: "faculty@connect.edu",
    password: "Faculty@123",
    role: "faculty",
    name: "Faculty User"
  },
  {
    username: "student@connect.edu",
    password: "Student@123",
    role: "student",
    name: "Student User"
  }
];

// Mock authentication function - made async to simulate real API call
export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = sampleUsers.find(
    u => u.username === username && u.password === password
  );
  return user || null;
};